import { Injectable, inject } from '@angular/core';
import type { User } from '@supabase/supabase-js';
import { SupabaseAuthService } from './supabase-auth.service';
import type { MissionBoardEntryRow, MissionBoardRank } from '../models/mission-board.model';

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

  async createMission(input: {
    rank: MissionBoardRank;
    name: string;
    description: string;
    notes: string;
    reward_experience: string;
    reward_ryo: string;
    reward_downtime: string;
  }): Promise<MissionBoardEntryRow> {
    const user = await this.requireUserForMutation();
    const { data, error } = await this.withTimeout(
      this.auth.client
        .from('mission_board_entries')
        .insert({
          rank: input.rank,
          name: input.name.trim(),
          description: input.description.trim(),
          notes: input.notes.trim(),
          reward_experience: input.reward_experience.trim(),
          reward_ryo: input.reward_ryo.trim(),
          reward_downtime: input.reward_downtime.trim(),
          created_by: user.id
        })
        .select(
          'id, rank, name, description, notes, reward_experience, reward_ryo, reward_downtime, created_at, created_by'
        )
        .single<MissionBoardEntryRow>(),
      'Saving mission'
    );
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
}
