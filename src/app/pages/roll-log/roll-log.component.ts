import { DatePipe, NgClass } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { RollEvent } from '../../core/models/roll-event.model';
import { AdminService } from '../../core/services/admin.service';
import { RollLogService } from '../../core/services/roll-log.service';
import { SupabaseAuthService } from '../../core/services/supabase-auth.service';

type ParsedSlashRoll = {
  who: string;
  formula: string;
  total: string;
  breakdown: string | null;
};

type NatHighlight = 'nat1' | 'nat20' | null;

@Component({
  selector: 'app-roll-log',
  imports: [RouterLink, FormsModule, DatePipe, NgClass],
  templateUrl: './roll-log.component.html',
  styleUrl: './roll-log.component.scss'
})
export class RollLogComponent {
  private readonly auth = inject(SupabaseAuthService);
  private readonly rollLogService = inject(RollLogService);
  readonly admin = inject(AdminService);

  readonly events = signal<RollEvent[]>([]);
  readonly status = signal<'connecting' | 'ready' | 'error'>('connecting');
  readonly chatDraft = signal('');
  readonly chatSending = signal(false);
  readonly commandError = signal<string | null>(null);
  readonly clearBusy = signal(false);
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
          await this.admin.refreshAdminState();
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

  async clearEntireLog(): Promise<void> {
    await this.admin.refreshAdminState();
    if (!this.admin.isAdmin()) {
      return;
    }
    if (!window.confirm('Clear the entire roll and chat log for everyone? This cannot be undone.')) {
      return;
    }
    this.clearBusy.set(true);
    try {
      await this.admin.clearRollLog();
      this.events.set([]);
    } catch (error) {
      this.commandError.set((error as Error).message);
    } finally {
      this.clearBusy.set(false);
    }
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

  /** Readable skill check line: `1d20+5 = 18` (modifier is the skill/ability bonus applied). */
  skillRollFormulaLine(e: RollEvent): string {
    const mod = this.formatModifier(e.modifier ?? 0);
    return `1d20${mod} = ${e.total ?? '—'}`;
  }

  /** Skill / save rolls: color by natural d20 on the die. */
  skillD20Highlight(e: RollEvent): NatHighlight {
    const n = e.d20;
    if (n === 1) {
      return 'nat1';
    }
    if (n === 20) {
      return 'nat20';
    }
    return null;
  }

  /** `/roll` lines: inspect d20[n,…] groups in the stored breakdown. */
  slashD20Highlight(parsed: ParsedSlashRoll): NatHighlight {
    return this.natHighlightFromBreakdown(parsed.breakdown);
  }

  private natHighlightFromBreakdown(breakdown: string | null): NatHighlight {
    if (!breakdown) {
      return null;
    }
    const values: number[] = [];
    const re = /\d*d20\[([^\]]+)\]/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(breakdown)) !== null) {
      const inner = m[1];
      for (const part of inner.split(',')) {
        const n = Number.parseInt(part.trim(), 10);
        if (Number.isFinite(n)) {
          values.push(n);
        }
      }
    }
    if (values.length === 0) {
      return null;
    }
    if (values.some((v) => v === 20)) {
      return 'nat20';
    }
    if (values.some((v) => v === 1)) {
      return 'nat1';
    }
    return null;
  }

  natClasses(kind: NatHighlight): Record<string, boolean> {
    return {
      'rl-nat20': kind === 'nat20',
      'rl-nat1': kind === 'nat1'
    };
  }

  /**
   * Parses `/roll` chat lines: `[ROLL] who: expression = total (breakdown)`.
   */
  parseSlashRollMessage(message: string | undefined): ParsedSlashRoll | null {
    if (!message?.startsWith('[ROLL]')) {
      return null;
    }
    const afterTag = message.slice(6).trim();
    const colonIdx = afterTag.indexOf(':');
    if (colonIdx < 0) {
      return null;
    }
    const who = afterTag.slice(0, colonIdx).trim();
    const rest = afterTag.slice(colonIdx + 1).trim();
    const eqIdx = rest.indexOf('=');
    if (eqIdx < 0) {
      return null;
    }
    const formula = rest.slice(0, eqIdx).trim();
    let afterEq = rest.slice(eqIdx + 1).trim();
    let breakdown: string | null = null;
    const open = afterEq.indexOf('(');
    if (open >= 0) {
      const close = afterEq.lastIndexOf(')');
      const total = afterEq.slice(0, open).trim();
      if (close > open) {
        breakdown = afterEq.slice(open + 1, close).trim();
      }
      return { who, formula, total, breakdown };
    }
    return { who, formula, total: afterEq, breakdown: null };
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
    return `[ROLL] ${userEmail}: ${expression} = ${total} (${breakdown})`;
  }

  private rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }
}
