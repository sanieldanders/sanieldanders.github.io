import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { ABILITY_LAYOUT } from '../../core/character/ability-layout';
import { ensureCharacterSheet, type CharacterWithSheet } from '../../core/character/character-sheet.defaults';
import type { AbilityAbbr, CharacterSheetState, SkillDot } from '../../core/models/app-data.model';
import { DataStoreService } from '../../core/services/data-store.service';

@Component({
  selector: 'app-character-sheet',
  imports: [RouterLink, FormsModule],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.scss'
})
export class CharacterSheetComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(DataStoreService);

  readonly abilityLayout = ABILITY_LAYOUT;
  readonly attackRowIndexes = [0, 1, 2, 3, 4, 5, 6, 7] as const;

  private readonly characterId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('characterId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('characterId') ?? '' }
  );

  /** Working copy; synced from store when the route id changes (not on every persist, to avoid focus races). */
  readonly draft = signal<CharacterWithSheet | null>(null);

  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private loadedCharacterId = '';

  constructor() {
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
}
