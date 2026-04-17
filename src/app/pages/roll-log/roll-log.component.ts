import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { RollEvent } from '../../core/models/roll-event.model';
import { RollLogService } from '../../core/services/roll-log.service';
import { SupabaseAuthService } from '../../core/services/supabase-auth.service';

@Component({
  selector: 'app-roll-log',
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './roll-log.component.html',
  styleUrl: './roll-log.component.scss'
})
export class RollLogComponent {
  private readonly auth = inject(SupabaseAuthService);
  private readonly rollLogService = inject(RollLogService);

  readonly events = signal<RollEvent[]>([]);
  readonly status = signal<'connecting' | 'ready' | 'error'>('connecting');
  readonly chatDraft = signal('');
  readonly chatSending = signal(false);

  constructor() {
    effect((onCleanup) => {
      let disposed = false;
      let unsub: (() => void) | null = null;
      this.status.set('connecting');
      void (async () => {
        try {
          await this.auth.init();
          const recent = await this.rollLogService.loadRecentGlobal();
          if (!disposed) {
            this.events.set(recent);
            this.status.set('ready');
          }
          if (!disposed) {
            unsub = this.rollLogService.subscribeToAll((event) => {
              this.events.update((prev) => {
                if (prev.some((e) => e.id === event.id)) {
                  return prev;
                }
                return [event, ...prev].slice(0, 150);
              });
            });
          }
        } catch {
          if (!disposed) {
            this.status.set('error');
          }
        }
      })();
      onCleanup(() => {
        disposed = true;
        if (unsub) {
          unsub();
        }
      });
    });
  }

  async sendChatMessage(): Promise<void> {
    const message = this.chatDraft().trim();
    if (!message) {
      return;
    }
    const user = this.auth.user();
    if (!user) {
      return;
    }
    this.chatSending.set(true);
    try {
      const created = await this.rollLogService.createMessage({
        characterId: 'global',
        userId: user.id,
        userEmail: user.email ?? 'unknown@user',
        message
      });
      this.chatDraft.set('');
      this.events.update((prev) => {
        if (prev.some((e) => e.id === created.id)) {
          return prev;
        }
        return [created, ...prev].slice(0, 150);
      });
    } catch {
      this.status.set('error');
    } finally {
      this.chatSending.set(false);
    }
  }

  formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }
}
