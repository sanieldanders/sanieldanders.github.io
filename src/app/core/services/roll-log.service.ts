import { Injectable, inject } from '@angular/core';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { NewChatMessageEvent, NewRollEvent, RollEvent } from '../models/roll-event.model';
import { SupabaseAuthService } from './supabase-auth.service';

type RollEventRow = {
  id: string;
  event_type: 'roll' | 'message';
  character_id: string;
  user_id: string;
  user_email: string;
  roller_name?: string | null;
  skill: string | null;
  ability: string | null;
  d20: number | null;
  modifier: number | null;
  total: number | null;
  message: string | null;
  created_at: string;
};

const ROLLER_NAME_FALLBACK_PREFIX = '__roller_name__:';

const REALTIME_RETRY_MS = 1500;
const REALTIME_MAX_SUBSCRIBE_ATTEMPTS = 2;

@Injectable({ providedIn: 'root' })
export class RollLogService {
  private readonly auth = inject(SupabaseAuthService);

  async loadRecentGlobal(limit = 100): Promise<RollEvent[]> {
    const { data, error } = await this.auth.client
      .from('roll_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      throw error;
    }
    return (data ?? []).map((row) => this.fromRow(row as RollEventRow));
  }

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
    const primaryInsert = await this.auth.client
      .from('roll_events')
      .insert({
        event_type: 'roll',
        character_id: input.characterId,
        user_id: input.userId,
        user_email: input.userEmail,
        roller_name: input.rollerName,
        skill: input.skill,
        ability: input.ability,
        d20: input.d20,
        modifier: input.modifier,
        total: input.total
      })
      .select('*')
      .single();
    if (!primaryInsert.error) {
      return this.fromRow(primaryInsert.data as RollEventRow);
    }

    const missingRollerNameColumn =
      primaryInsert.error.message.includes('roller_name') &&
      primaryInsert.error.message.toLowerCase().includes('column');
    if (!missingRollerNameColumn) {
      throw primaryInsert.error;
    }

    const fallbackInsert = await this.auth.client
      .from('roll_events')
      .insert({
        event_type: 'roll',
        character_id: input.characterId,
        user_id: input.userId,
        user_email: input.userEmail,
        message: `${ROLLER_NAME_FALLBACK_PREFIX}${input.rollerName}`,
        skill: input.skill,
        ability: input.ability,
        d20: input.d20,
        modifier: input.modifier,
        total: input.total
      })
      .select('*')
      .single();
    if (fallbackInsert.error) {
      throw fallbackInsert.error;
    }
    return this.fromRow(fallbackInsert.data as RollEventRow);
  }

  async createMessage(input: NewChatMessageEvent): Promise<RollEvent> {
    const { data, error } = await this.auth.client
      .from('roll_events')
      .insert({
        event_type: 'message',
        character_id: input.characterId,
        user_id: input.userId,
        user_email: input.userEmail,
        message: input.message.trim()
      })
      .select('*')
      .single();
    if (error) {
      throw error;
    }
    return this.fromRow(data as RollEventRow);
  }

  subscribeToCharacter(characterId: string, onInsert: (event: RollEvent) => void): () => void {
    return this.subscribeWithRetry((channelName) =>
      this.auth.client
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
    );
  }

  subscribeToAll(onInsert: (event: RollEvent) => void): () => void {
    return this.subscribeWithRetry((channelName) =>
      this.auth.client
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'roll_events'
          },
          (payload) => {
            if (payload.new) {
              onInsert(this.fromRow(payload.new as RollEventRow));
            }
          }
        )
    );
  }

  /**
   * Subscribes to postgres_changes with a short automatic retry if the channel errors or times out
   * (common when JWT/session was not ready on first attempt).
   */
  private subscribeWithRetry(buildChannel: (channelName: string) => RealtimeChannel): () => void {
    let disposed = false;
    let activeChannel: RealtimeChannel | null = null;
    let attempt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const cleanupChannel = (): void => {
      if (activeChannel) {
        void this.auth.client.removeChannel(activeChannel);
        activeChannel = null;
      }
    };

    const scheduleRetry = (): void => {
      if (disposed || attempt >= REALTIME_MAX_SUBSCRIBE_ATTEMPTS) {
        return;
      }
      if (retryTimer) {
        return;
      }
      retryTimer = setTimeout(() => {
        retryTimer = null;
        connect();
      }, REALTIME_RETRY_MS);
    };

    const connect = (): void => {
      if (disposed || attempt >= REALTIME_MAX_SUBSCRIBE_ATTEMPTS) {
        return;
      }
      attempt += 1;
      cleanupChannel();
      const channelName = `roll-events:${crypto.randomUUID()}`;
      activeChannel = buildChannel(channelName).subscribe((status) => {
        if (disposed) {
          return;
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          cleanupChannel();
          scheduleRetry();
        }
      });
    };

    connect();

    return () => {
      disposed = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      cleanupChannel();
    };
  }

  private fromRow(row: RollEventRow): RollEvent {
    const parsedFallbackRollerName = this.parseFallbackRollerName(row.message);
    return {
      id: row.id,
      kind: row.event_type,
      characterId: row.character_id,
      userId: row.user_id,
      userEmail: row.user_email,
      rollerName: row.roller_name ?? parsedFallbackRollerName ?? undefined,
      skill: row.skill ?? undefined,
      ability: (row.ability as RollEvent['ability']) ?? undefined,
      d20: row.d20 ?? undefined,
      modifier: row.modifier ?? undefined,
      total: row.total ?? undefined,
      message: this.stripFallbackRollerName(row.message) ?? undefined,
      createdAt: row.created_at
    };
  }

  private parseFallbackRollerName(message: string | null): string | null {
    if (!message || !message.startsWith(ROLLER_NAME_FALLBACK_PREFIX)) {
      return null;
    }
    return message.slice(ROLLER_NAME_FALLBACK_PREFIX.length).trim() || null;
  }

  private stripFallbackRollerName(message: string | null): string | null {
    if (!message || !message.startsWith(ROLLER_NAME_FALLBACK_PREFIX)) {
      return message;
    }
    return null;
  }
}
