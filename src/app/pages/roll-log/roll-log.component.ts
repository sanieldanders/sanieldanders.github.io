import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
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
  readonly commandError = signal<string | null>(null);
  readonly sidebarMode = input(false);

  private readonly allowedDice = new Set([4, 6, 8, 10, 12, 20, 100]);

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
    this.commandError.set(null);
    try {
      const rollText = this.tryBuildRollMessage(message);
      const payloadMessage = rollText ?? message;
      const created = await this.rollLogService.createMessage({
        characterId: 'global',
        userId: user.id,
        userEmail: user.email ?? 'unknown@user',
        message: payloadMessage
      });
      this.chatDraft.set('');
      this.events.update((prev) => {
        if (prev.some((e) => e.id === created.id)) {
          return prev;
        }
        return [created, ...prev].slice(0, 150);
      });
    } catch {
      if (!this.commandError()) {
        this.status.set('error');
      }
    } finally {
      this.chatSending.set(false);
    }
  }

  formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  private tryBuildRollMessage(input: string): string | null {
    if (!input.toLowerCase().startsWith('/roll ')) {
      return null;
    }
    const expression = input.slice(6).replace(/\s+/g, '');
    if (!expression) {
      this.commandError.set('Usage: /roll 1d20+5');
      throw new Error('invalid roll command');
    }

    const tokens = expression.match(/[+\-]?[^+\-]+/g) ?? [];
    if (tokens.length === 0) {
      this.commandError.set('Invalid roll expression.');
      throw new Error('invalid roll command');
    }

    const parts: string[] = [];
    let total = 0;
    for (const token of tokens) {
      const sign = token.startsWith('-') ? -1 : 1;
      const raw = token.replace(/^[+\-]/, '');
      if (!raw) {
        this.commandError.set('Invalid roll expression.');
        throw new Error('invalid roll command');
      }

      const diceMatch = raw.match(/^(\d*)d(\d+)$/i);
      if (diceMatch) {
        const count = diceMatch[1] ? Number.parseInt(diceMatch[1], 10) : 1;
        const sides = Number.parseInt(diceMatch[2], 10);
        if (!Number.isFinite(count) || count < 1 || count > 100) {
          this.commandError.set('Dice count must be between 1 and 100.');
          throw new Error('invalid roll command');
        }
        if (!this.allowedDice.has(sides)) {
          this.commandError.set('Supported dice: d4, d6, d8, d10, d12, d20, d100.');
          throw new Error('invalid roll command');
        }
        const rolls: number[] = [];
        for (let i = 0; i < count; i++) {
          rolls.push(this.rollDie(sides));
        }
        const subtotal = rolls.reduce((sum, r) => sum + r, 0) * sign;
        total += subtotal;
        const signLabel = sign < 0 ? '-' : '+';
        parts.push(`${signLabel}${count}d${sides}[${rolls.join(',')}]`);
        continue;
      }

      const num = Number.parseInt(raw, 10);
      if (!Number.isFinite(num)) {
        this.commandError.set('Use numbers and dice only (example: /roll 2d6+3).');
        throw new Error('invalid roll command');
      }
      const signed = num * sign;
      total += signed;
      const signLabel = signed < 0 ? '-' : '+';
      parts.push(`${signLabel}${Math.abs(num)}`);
    }

    const userEmail = this.auth.user()?.email ?? 'unknown@user';
    const breakdown = parts.join(' ').replace(/^\+/, '');
    return `[ROLL] ${userEmail} rolled ${expression} = ${total} (${breakdown})`;
  }

  private rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }
}
