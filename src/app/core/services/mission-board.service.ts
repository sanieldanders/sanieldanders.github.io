import { Injectable, inject } from '@angular/core';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import { SupabaseAuthService } from './supabase-auth.service';
import {
  MISSION_BOARD_FIELD_LIMITS,
  type MissionBoardEntryRow,
  type MissionBoardRank
} from '../models/mission-board.model';

@Injectable({ providedIn: 'root' })
export class MissionBoardService {
  private readonly auth = inject(SupabaseAuthService);
  private static readonly REQUEST_TIMEOUT_MS = 30000;

  private async withTimeout<T>(promiseLike: PromiseLike<T>, action: string): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error(`${action} timed out. Please try again.`)),
        MissionBoardService.REQUEST_TIMEOUT_MS
      );
    });
    try {
      return await Promise.race([Promise.resolve(promiseLike), timeout]);
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }

  /** Uses live auth session (not signals) so mutations run after JWT is ready for RLS. */
  private async requireUserForMutation(): Promise<User> {
    await this.auth.init();
    const client = this.auth.client;
    const first = await client.auth.getSession();
    if (first.error) {
      throw new Error(first.error.message);
    }
    let user = first.data.session?.user ?? null;
    if (!user) {
      const refreshed = await client.auth.refreshSession();
      if (refreshed.error) {
        throw new Error('You must be signed in to change the mission board.');
      }
      user = refreshed.data.session?.user ?? null;
    }
    if (!user) {
      throw new Error('You must be signed in to change the mission board.');
    }
    return user;
  }

  private mapMutationError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('violates row-level security') || m.includes('permission denied') || m.includes('rls')) {
      return 'Could not save (permission denied). Admin access is required to post missions.';
    }
    return message;
  }

  async listMissions(): Promise<MissionBoardEntryRow[]> {
    await this.auth.init();
    const { data, error } = await this.withTimeout(
      this.auth.client
        .from('mission_board_entries')
        .select(
          'id, rank, name, description, notes, reward_experience, reward_ryo, reward_downtime, created_at, created_by'
        )
        .order('created_at', { ascending: false }),
      'Loading missions'
    );
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as MissionBoardEntryRow[];
  }

  private assertFieldLength(label: string, value: string, max: number): void {
    if (value.length > max) {
      throw new Error(`${label} must be ${max.toLocaleString()} characters or fewer (currently ${value.length.toLocaleString()}).`);
    }
  }

  async createMission(input: {
    rank: MissionBoardRank;
    name: string;
    description: string;
    notes: string;
    reward_experience: string;
    reward_ryo: string;
    reward_downtime: string;
  }): Promise<MissionBoardEntryRow> {
    const name = input.name.trim();
    const description = input.description.trim();
    const notes = input.notes.trim();
    const rewardExperience = input.reward_experience.trim();
    const rewardRyo = input.reward_ryo.trim();
    const rewardDowntime = input.reward_downtime.trim();

    this.assertFieldLength('Name', name, MISSION_BOARD_FIELD_LIMITS.name);
    this.assertFieldLength('Description', description, MISSION_BOARD_FIELD_LIMITS.description);
    this.assertFieldLength('Notes', notes, MISSION_BOARD_FIELD_LIMITS.notes);
    this.assertFieldLength('Experience reward', rewardExperience, MISSION_BOARD_FIELD_LIMITS.reward);
    this.assertFieldLength('Ryo reward', rewardRyo, MISSION_BOARD_FIELD_LIMITS.reward);
    this.assertFieldLength('Downtime reward', rewardDowntime, MISSION_BOARD_FIELD_LIMITS.reward);

    return this.withTimeout(this.insertMission(input.rank, name, description, notes, rewardExperience, rewardRyo, rewardDowntime), 'Saving mission');
  }

  private async insertMission(
    rank: MissionBoardRank,
    name: string,
    description: string,
    notes: string,
    rewardExperience: string,
    rewardRyo: string,
    rewardDowntime: string
  ): Promise<MissionBoardEntryRow> {
    const user = await this.requireUserForMutation();
    const { data, error } = await this.auth.client
      .from('mission_board_entries')
      .insert({
        rank,
        name,
        description,
        notes,
        reward_experience: rewardExperience,
        reward_ryo: rewardRyo,
        reward_downtime: rewardDowntime,
        created_by: user.id
      })
      .select(
        'id, rank, name, description, notes, reward_experience, reward_ryo, reward_downtime, created_at, created_by'
      )
      .single<MissionBoardEntryRow>();
    if (error) {
      throw new Error(this.mapMutationError(error.message));
    }
    if (!data) {
      throw new Error('Mission was not returned after save. Try refreshing the list.');
    }
    return data;
  }

  async deleteMission(id: string): Promise<void> {
    await this.requireUserForMutation();
    const { error } = await this.withTimeout(
      this.auth.client.from('mission_board_entries').delete().eq('id', id),
      'Removing mission'
    );
    if (error) {
      throw new Error(this.mapMutationError(error.message));
    }
  }

  async subscribeToChanges(onChange: () => void): Promise<() => void> {
    await this.auth.init();
    const channelName = `missions-live-${crypto.randomUUID()}`;
    const channel = this.auth.client
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mission_board_entries' },
        () => onChange()
      );

    channel.subscribe();
    return () => {
      void this.removeChannel(channel);
    };
  }

  private async removeChannel(channel: RealtimeChannel): Promise<void> {
    try {
      await this.auth.client.removeChannel(channel);
    } catch {
      // Ignore teardown failures to avoid breaking view cleanup.
    }
  }
}
