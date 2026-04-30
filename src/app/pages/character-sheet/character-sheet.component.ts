import { TitleCasePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { ABILITY_LAYOUT } from '../../core/character/ability-layout';
import { ensureCharacterSheet, type CharacterWithSheet } from '../../core/character/character-sheet.defaults';
import {
  CHAKRA_NATURE_META,
  JUTSU_LIST_LINES_PER_RANK,
  type AbilityAbbr,
  type CharacterProfileSheetState,
  type CharacterSheetState,
  type ChakraNature,
  type JutsuClassification,
  type JutsuRank,
  type SkillDot
} from '../../core/models/app-data.model';
import type { JutsuCompendiumEntry, JutsuCompendiumPayload } from '../../core/models/jutsu-compendium.model';
import { DataStoreService } from '../../core/services/data-store.service';
import { RollLogService } from '../../core/services/roll-log.service';
import { SupabaseAuthService } from '../../core/services/supabase-auth.service';

@Component({
  selector: 'app-character-sheet',
  imports: [RouterLink, FormsModule, TitleCasePipe],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.scss'
})
export class CharacterSheetComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(DataStoreService);
  private readonly auth = inject(SupabaseAuthService);
  private readonly rollLogService = inject(RollLogService);

  readonly abilityLayout = ABILITY_LAYOUT;
  readonly attackRowIndexes = [0, 1, 2, 3, 4, 5, 6, 7] as const;
  readonly quadrantIndexes = [0, 1, 2, 3] as const;
  readonly natureMeta = CHAKRA_NATURE_META;

  /** Main ND&D sheet, profile sheet, or printable jutsu list. */
  readonly sheetTab = signal<'main' | 'profile' | 'jutsu'>('main');

  readonly jutsuLineIndexes = Array.from({ length: JUTSU_LIST_LINES_PER_RANK }, (_, i) => i);

  readonly jutsuColumnRanks: ReadonlyArray<readonly JutsuRank[]> = [
    ['E', 'D'],
    ['C', 'B'],
    ['A', 'S']
  ];
  readonly compendiumJutsu = signal<JutsuCompendiumEntry[]>([]);
  readonly addSelectionByRank = signal<Record<JutsuRank, string>>({
    E: '',
    D: '',
    C: '',
    B: '',
    A: '',
    S: ''
  });

  private readonly characterId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('characterId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('characterId') ?? '' }
  );

  /** Working copy; synced from store when the route id changes (not on every persist, to avoid focus races). */
  readonly draft = signal<CharacterWithSheet | null>(null);

  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private loadedCharacterId = '';

  constructor() {
    this.http
      .get<JutsuCompendiumPayload>('jutsu-compendium.json')
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (payload) => {
          this.compendiumJutsu.set((payload.entries ?? []).filter((e) => e.kind === 'jutsu'));
        },
        error: () => {
          this.compendiumJutsu.set([]);
        }
      });

    effect(() => {
      const id = this.characterId();
      if (id !== this.loadedCharacterId) {
        this.loadedCharacterId = id;
        const c = id ? this.store.getCharacter(id) : undefined;
        this.draft.set(c ? structuredClone(ensureCharacterSheet(c)) : null);
      }
    });
  }

  private scheduleSave(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      const id = this.characterId();
      const d = this.draft();
      if (id && d) {
        this.store.updateCharacter(id, d);
      }
    }, 380);
  }

  private patch(mut: (ch: CharacterWithSheet) => void): void {
    const cur = this.draft();
    if (!cur) {
      return;
    }
    const d = structuredClone(cur);
    mut(d);
    this.draft.set(d);
    this.scheduleSave();
  }

  onName(value: string): void {
    this.patch((ch) => {
      ch.name = value;
    });
  }

  onRailField<K extends keyof CharacterSheetState['rail']>(key: K, value: string): void {
    this.patch((ch) => {
      ch.sheet.rail[key] = value;
    });
  }

  onIdentityField<K extends keyof CharacterSheetState['identity']>(key: K, value: string): void {
    this.patch((ch) => {
      ch.sheet.identity[key] = value;
    });
  }

  onCombatField<K extends keyof CharacterSheetState['combat']>(key: K, value: string): void {
    this.patch((ch) => {
      ch.sheet.combat[key] = value;
    });
  }

  onAbilityScore(abbr: AbilityAbbr, value: string): void {
    this.patch((ch) => {
      ch.sheet.abilities[abbr].score = value;
    });
  }

  onAbilityMod(abbr: AbilityAbbr, value: string): void {
    this.patch((ch) => {
      ch.sheet.abilities[abbr].mod = value;
    });
  }

  onSkillMod(abbr: AbilityAbbr, skill: string, value: string): void {
    this.patch((ch) => {
      ch.sheet.abilities[abbr].skills[skill].mod = value;
    });
  }

  async rollSkill(abbr: AbilityAbbr, skill: string): Promise<void> {
    const ch = this.draft();
    if (!ch) {
      return;
    }
    const user = this.auth.user();
    if (!user) {
      return;
    }
    const skillModRaw = ch.sheet.abilities[abbr].skills[skill]?.mod ?? '';
    const abilityModRaw = ch.sheet.abilities[abbr].mod ?? '';
    const modifier = this.parseModifier(skillModRaw) ?? this.parseModifier(abilityModRaw) ?? 0;
    const d20 = this.rollDie(20);
    const total = d20 + modifier;
    const characterId = this.characterId();
    if (!characterId) {
      return;
    }
    try {
      await this.rollLogService.createRoll({
        characterId,
        userId: user.id,
        userEmail: user.email ?? 'unknown@user',
        rollerName: ch.name.trim() || 'Unnamed character',
        skill,
        ability: abbr,
        d20,
        modifier,
        total
      });
    } catch {}
  }

  formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  private parseModifier(value: string): number | null {
    const cleaned = value.trim().replace(/\s+/g, '');
    if (!cleaned) {
      return null;
    }
    const n = Number.parseInt(cleaned, 10);
    if (Number.isNaN(n)) {
      return null;
    }
    return n;
  }

  private rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }

  cycleSkillDot(abbr: AbilityAbbr, skill: string): void {
    const order: SkillDot[] = ['none', 'black', 'red'];
    this.patch((ch) => {
      const row = ch.sheet.abilities[abbr].skills[skill];
      const i = order.indexOf(row.dot);
      row.dot = order[(i + 1) % order.length];
    });
  }

  dotLabel(dot: SkillDot): string {
    if (dot === 'black') {
      return 'Proficient';
    }
    if (dot === 'red') {
      return 'Expertise or special';
    }
    return 'Not marked';
  }

  onAttackField(index: number, field: keyof CharacterSheetState['attacks'][number], value: string): void {
    this.patch((ch) => {
      ch.sheet.attacks[index][field] = value;
    });
  }

  onTraitField<K extends keyof CharacterSheetState['traits']>(key: K, value: string): void {
    this.patch((ch) => {
      ch.sheet.traits[key] = value;
    });
  }

  onEquipment(value: string): void {
    this.patch((ch) => {
      ch.sheet.equipment = value;
    });
  }

  setSheetTab(tab: 'main' | 'profile' | 'jutsu'): void {
    this.sheetTab.set(tab);
  }

  onJutsuSummary(kind: 'ninjutsu' | 'taijutsu' | 'genjutsu', field: 'attackBonus' | 'saveDc', value: string): void {
    this.patch((ch) => {
      ch.sheet.jutsuListSheet[kind][field] = value;
    });
  }

  onJutsuRankLine(rank: JutsuRank, index: number, value: string): void {
    this.patch((ch) => {
      const lines = [...ch.sheet.jutsuListSheet.ranks[rank]] as string[];
      lines[index] = value;
      ch.sheet.jutsuListSheet.ranks[rank] = lines;
    });
  }

  addJutsuToRank(rank: JutsuRank): void {
    const jutsuId = this.addSelectionByRank()[rank];
    if (!jutsuId) {
      return;
    }
    const picked = this.compendiumJutsu().find((j) => j.id === jutsuId);
    if (!picked) {
      return;
    }
    let added = false;
    this.patch((ch) => {
      const lines = [...ch.sheet.jutsuListSheet.ranks[rank]] as string[];
      const target = lines.findIndex((line) => line.trim().length === 0);
      if (target < 0) {
        return;
      }
      lines[target] = picked.name;
      ch.sheet.jutsuListSheet.ranks[rank] = lines;
      added = true;
    });
    if (added) {
      this.setAddSelection(rank, '');
    }
  }

  setAddSelection(rank: JutsuRank, value: string): void {
    this.addSelectionByRank.update((cur) => ({ ...cur, [rank]: value }));
  }

  addSelection(rank: JutsuRank): string {
    return this.addSelectionByRank()[rank] ?? '';
  }

  jutsuForLine(name: string): JutsuCompendiumEntry | null {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) {
      return null;
    }
    return this.compendiumJutsu().find((j) => j.name.trim().toLowerCase() === trimmed) ?? null;
  }

  isUnmatchedJutsuLine(name: string): boolean {
    return name.trim().length > 0 && !this.jutsuForLine(name);
  }

  onProfilePhysical<K extends keyof CharacterProfileSheetState['physical']>(key: K, value: string): void {
    this.patch((ch) => {
      ch.sheet.profileSheet.physical[key] = value;
    });
  }

  onProfileText<K extends CharacterProfileTextKey>(key: K, value: string): void {
    this.patch((ch) => {
      ch.sheet.profileSheet[key] = value;
    });
  }

  onProfileQuadrant(index: number, value: string): void {
    this.patch((ch) => {
      const next: CharacterProfileSheetState['quadrants'] = [...ch.sheet.profileSheet.quadrants] as [
        string,
        string,
        string,
        string
      ];
      next[index] = value;
      ch.sheet.profileSheet.quadrants = next;
    });
  }

  toggleNature(id: ChakraNature): void {
    this.patch((ch) => {
      const cur = ch.sheet.profileSheet.natureSelected[id];
      ch.sheet.profileSheet.natureSelected[id] = !cur;
    });
  }

  startNewJutsu(kind: JutsuClassification): void {
    const id = this.characterId();
    if (!id) {
      return;
    }
    const draft = this.store.newDraftForCharacter(id, kind);
    void this.router.navigate(['/characters', id, 'jutsu', draft.id], { queryParams: { edit: '1' } });
  }

  removeCharacterJutsu(jutsuId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const id = this.characterId();
    if (!id || !confirm('Delete this jutsu?')) {
      return;
    }
    this.store.deleteJutsuFromCharacter(id, jutsuId);
    this.patch((ch) => {
      ch.jutsus = (ch.jutsus ?? []).filter((j) => j.id !== jutsuId);
    });
  }
}

type CharacterProfileTextKey =
  | 'appearance'
  | 'backstory'
  | 'villageRank'
  | 'alliesOrganizations'
  | 'additionalFeatures'
  | 'capsule';
