import { Injectable, inject } from '@angular/core';
import { SupabaseAuthService } from './supabase-auth.service';
import type { MissionBoardEntryRow, MissionBoardRank } from '../models/mission-board.model';

@Injectable({ providedIn: 'root' })
export class MissionBoardService {
  private readonly auth = inject(SupabaseAuthService);
  private static readonly REQUEST_TIMEOUT_MS = 30000;

  private async withTimeout<T>(promiseLike: PromiseLike<T>, action: string): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${action} timed out. Please try again.`)), MissionBoardService.REQUEST_TIMEOUT_MS);
    });
    return Promise.race([Promise.resolve(promiseLike), timeout]);
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
    await this.auth.init();
    const user = this.auth.user();
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
          created_by: user?.id ?? null
        })
        .select(
          'id, rank, name, description, notes, reward_experience, reward_ryo, reward_downtime, created_at, created_by'
        )
        .single<MissionBoardEntryRow>(),
      'Saving mission'
    );
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async deleteMission(id: string): Promise<void> {
    await this.auth.init();
    const { error } = await this.withTimeout(
      this.auth.client.from('mission_board_entries').delete().eq('id', id),
      'Removing mission'
    );
    if (error) {
      throw new Error(error.message);
    }
  }
}
