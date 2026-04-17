import { Injectable, inject } from '@angular/core';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { NewRollEvent, RollEvent } from '../models/roll-event.model';
import { SupabaseAuthService } from './supabase-auth.service';

type RollEventRow = {
  id: string;
  character_id: string;
  user_id: string;
  user_email: string;
  skill: string;
  ability: string;
  d20: number;
  modifier: number;
  total: number;
  created_at: string;
};

@Injectable({ providedIn: 'root' })
export class RollLogService {
  private readonly auth = inject(SupabaseAuthService);

  async loadRecent(characterId: string, limit = 50): Promise<RollEvent[]> {
    const { data, error } = await this.auth.client
      .from('roll_events')
      .select('*')
      .eq('character_id', characterId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      throw error;
    }
    return (data ?? []).map((row) => this.fromRow(row as RollEventRow));
  }

  async createRoll(input: NewRollEvent): Promise<RollEvent> {
    const { data, error } = await this.auth.client
      .from('roll_events')
      .insert({
        character_id: input.characterId,
        user_id: input.userId,
        user_email: input.userEmail,
        skill: input.skill,
        ability: input.ability,
        d20: input.d20,
        modifier: input.modifier,
        total: input.total
      })
      .select('*')
      .single();
    if (error) {
      throw error;
    }
    return this.fromRow(data as RollEventRow);
  }

  subscribeToCharacter(characterId: string, onInsert: (event: RollEvent) => void): () => void {
    const channelName = `roll-events:${characterId}:${crypto.randomUUID()}`;
    const channel: RealtimeChannel = this.auth.client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'roll_events',
          filter: `character_id=eq.${characterId}`
        },
        (payload) => {
          if (payload.new) {
            onInsert(this.fromRow(payload.new as RollEventRow));
          }
        }
      )
      .subscribe();

    return () => {
      void this.auth.client.removeChannel(channel);
    };
  }

  private fromRow(row: RollEventRow): RollEvent {
    return {
      id: row.id,
      characterId: row.character_id,
      userId: row.user_id,
      userEmail: row.user_email,
      skill: row.skill,
      ability: row.ability as RollEvent['ability'],
      d20: row.d20,
      modifier: row.modifier,
      total: row.total,
      createdAt: row.created_at
    };
  }
}
