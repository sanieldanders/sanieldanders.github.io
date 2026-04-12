import { TitleCasePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import type { JutsuArchetype, JutsuDraft, JutsuEffectSelection, JutsuRank } from '../../core/models/app-data.model';
import {
  allowedEffectKeys,
  COMPONENT_CODES,
  damageDiceOptions,
  DAMAGE_DICE_OPTION_KEY,
  GENJUTSU_SENSORY_OPTIONS,
  getEffectDamageDice,
  NATURE_RELEASE_OPTIONS,
  NINJA_TOOL_OPTIONS,
  RANK_FINALIZE_TABLE,
  rulebookSummaryParagraphs,
  WEAPON_TYPE_OPTIONS
} from '../../core/rules/jutsu-rulebook';
import { DataStoreService } from '../../core/services/data-store.service';
import { JutsuRulesService } from '../../core/services/jutsu-rules.service';

const RANKS: JutsuRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];
const ARCHETYPES: JutsuArchetype[] = ['offensive', 'defensive', 'control', 'support'];

@Component({
  selector: 'app-jutsu-editor',
  imports: [FormsModule, RouterLink, TitleCasePipe],
  templateUrl: './jutsu-editor.component.html',
  styleUrl: './jutsu-editor.component.scss'
})
export class JutsuEditorComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(DataStoreService);
  private readonly rules = inject(JutsuRulesService);

  readonly ranks = RANKS;
  readonly archetypes = ARCHETYPES;
  readonly natureReleaseOptions = NATURE_RELEASE_OPTIONS;
  readonly genjutsuSensoryOptions = GENJUTSU_SENSORY_OPTIONS;
  readonly weaponTypeOptions = WEAPON_TYPE_OPTIONS;
  readonly ninjaToolOptions = NINJA_TOOL_OPTIONS;

  readonly ids = toSignal(
    this.route.paramMap.pipe(
      map((p) => ({
        profileId: p.get('profileId') ?? '',
        jutsuId: p.get('jutsuId') ?? ''
      }))
    ),
    {
      initialValue: {
        profileId: this.route.snapshot.paramMap.get('profileId') ?? '',
        jutsuId: this.route.snapshot.paramMap.get('jutsuId') ?? ''
      }
    }
  );

  /** Query `?edit=1` opens the full editor; default is read-only sheet view. */
  readonly editing = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('edit') === '1')),
    { initialValue: this.route.snapshot.queryParamMap.get('edit') === '1' }
  );

  readonly localDraft = signal<JutsuDraft | null>(null);
  readonly saveMessage = signal<string | null>(null);

  readonly maxSlots = computed(() => {
    const d = this.localDraft();
    if (!d) {
      return 0;
    }
    return this.rules.maxEffectSlots(d.rank, d.classification, d.prerequisites);
  });

  readonly archetypeError = computed(() => {
    const d = this.localDraft();
    if (!d) {
      return null;
    }
    return this.rules.validateArchetypes(d.archetypes);
  });

  readonly allowedEffects = computed(() => {
    const d = this.localDraft();
    if (!d) {
      return [] as string[];
    }
    return allowedEffectKeys(d.classification, d.archetypes);
  });

  readonly validationErrors = computed(() => {
    const d = this.localDraft();
    if (!d) {
      return [] as string[];
    }
    return this.rules.validateDraft(d);
  });

  ruleSummaryFor(classification: JutsuDraft['classification']): string[] {
    return rulebookSummaryParagraphs(classification);
  }

  enterEditMode(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: '1' },
      replaceUrl: false
    });
  }

  /** Reload last saved jutsu from storage and exit edit mode (discards unsaved edits). */
  cancelEdit(): void {
    if (!confirm('Discard unsaved changes and return to the read-only sheet?')) {
      return;
    }
    if (!this.loadDraftFromStore()) {
      return;
    }
    this.saveMessage.set(null);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
  }

  private normalizeDraftDefaults(d: JutsuDraft): void {
    d.finalize ??= {};
    if (d.classification === 'genjutsu') {
      d.prerequisites.genjutsuTiers ??= {
        criticalSuccess: true,
        success: true,
        failure: true,
        criticalFailure: false
      };
    }
  }

  /** Replace `localDraft` from the store for the current route ids. Returns false if missing. */
  private loadDraftFromStore(): boolean {
    const { profileId, jutsuId } = this.ids();
    const profile = this.store.getProfile(profileId);
    const found = profile?.jutsus.find((j) => j.id === jutsuId);
    if (!found) {
      this.localDraft.set(null);
      return false;
    }
    const copy = structuredClone(found);
    this.normalizeDraftDefaults(copy);
    this.localDraft.set(copy);
    return true;
  }

  damageDiceChoices(): readonly string[] {
    const d = this.localDraft();
    if (!d) {
      return [];
    }
    return damageDiceOptions(d.classification, d.rank);
  }

  effectDamageDice(effect: JutsuEffectSelection): string {
    return getEffectDamageDice(effect) ?? '';
  }

  setEffectDamageDice(effect: JutsuEffectSelection, value: string): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    effect.options ??= {};
    if (!value) {
      delete effect.options[DAMAGE_DICE_OPTION_KEY];
      if (Object.keys(effect.options).length === 0) {
        effect.options = undefined;
      }
    } else {
      effect.options[DAMAGE_DICE_OPTION_KEY] = value;
    }
    this.localDraft.set(structuredClone(d));
  }

  onEffectKeyChange(effect: JutsuEffectSelection, key: string): void {
    effect.effectKey = key;
    if (key !== 'Damage') {
      effect.options ??= {};
      delete effect.options[DAMAGE_DICE_OPTION_KEY];
      if (Object.keys(effect.options).length === 0) {
        effect.options = undefined;
      }
    }
    this.bumpDraft();
  }

  formatComponents(codes: string[] | undefined): string {
    return (codes ?? [])
      .map((c) => (COMPONENT_CODES as Record<string, string>)[c] ?? c)
      .join(', ');
  }

  formatArchetypes(archetypes: JutsuArchetype[]): string {
    return archetypes.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(', ');
  }

  formatPrereqKeywords(p: JutsuDraft['prerequisites']): string {
    const bits: string[] = [];
    if (p.hijutsu) {
      bits.push('Hijutsu');
    }
    if (p.medical) {
      bits.push('Medical');
    }
    if (p.fuinjutsu) {
      bits.push('Fuinjutsu');
    }
    return bits.length ? bits.join(', ') : '—';
  }

  formatRange(r: JutsuDraft['prerequisites']['range']): string {
    if (!r) {
      return '—';
    }
    switch (r) {
      case 'self':
        return 'Self';
      case 'touch':
        return 'Touch (5 ft)';
      case 'ranged':
        return 'Ranged';
      case 'inhaled':
        return 'Inhaled';
      case 'weapon_range':
        return 'Weapon range';
      default:
        return String(r);
    }
  }

  constructor() {
    effect(() => {
      this.loadDraftFromStore();
    });
  }

  toggleArchetype(a: JutsuArchetype): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    const set = new Set(d.archetypes);
    if (set.has(a)) {
      set.delete(a);
    } else {
      set.add(a);
    }
    d.archetypes = [...set];
    this.localDraft.set(structuredClone(d));
  }

  toggleComponent(code: string): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    const list = d.prerequisites.components ?? [];
    const has = list.includes(code);
    d.prerequisites.components = has ? list.filter((c) => c !== code) : [...list, code];
    this.localDraft.set(structuredClone(d));
  }

  hasComponent(code: string): boolean {
    return this.localDraft()?.prerequisites.components?.includes(code) ?? false;
  }

  addEffect(): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    const allowed = allowedEffectKeys(d.classification, d.archetypes);
    const effect: JutsuEffectSelection = {
      id: crypto.randomUUID(),
      effectKey: allowed[0] ?? '',
      notes: ''
    };
    d.effects = [...d.effects, effect];
    this.localDraft.set(structuredClone(d));
  }

  removeEffect(id: string): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    d.effects = d.effects.filter((e) => e.id !== id);
    this.localDraft.set(structuredClone(d));
  }

  bumpDraft(): void {
    const d = this.localDraft();
    if (d) {
      this.localDraft.set(structuredClone(d));
    }
  }

  toggleNatureRelease(id: string): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    const cur = d.prerequisites.natureReleases ?? [];
    const has = cur.includes(id);
    d.prerequisites.natureReleases = has ? cur.filter((x) => x !== id) : [...cur, id];
    if (!d.prerequisites.natureReleases.length) {
      d.prerequisites.natureReleases = undefined;
    }
    this.localDraft.set(structuredClone(d));
  }

  hasNatureRelease(id: string): boolean {
    return this.localDraft()?.prerequisites.natureReleases?.includes(id) ?? false;
  }

  toggleSensory(id: string): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    const cur = d.prerequisites.sensory ?? [];
    const has = cur.includes(id);
    d.prerequisites.sensory = has ? cur.filter((x) => x !== id) : [...cur, id];
    if (!d.prerequisites.sensory.length) {
      d.prerequisites.sensory = undefined;
    }
    this.localDraft.set(structuredClone(d));
  }

  hasSensory(id: string): boolean {
    return this.localDraft()?.prerequisites.sensory?.includes(id) ?? false;
  }

  onRankChange(rank: JutsuRank): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    d.rank = rank;
    if (rank === 'E') {
      d.prerequisites.requiredFeature = 'none';
    }
    const pools = new Set(damageDiceOptions(d.classification, rank));
    for (const eff of d.effects) {
      if (eff.effectKey?.trim() !== 'Damage') {
        continue;
      }
      const cur = getEffectDamageDice(eff);
      if (cur && !pools.has(cur)) {
        eff.options ??= {};
        delete eff.options[DAMAGE_DICE_OPTION_KEY];
        if (eff.options && Object.keys(eff.options).length === 0) {
          eff.options = undefined;
        }
      }
    }
    this.localDraft.set(structuredClone(d));
  }

  applyRankFinalizeTable(): void {
    const d = this.localDraft();
    if (!d) {
      return;
    }
    const row = RANK_FINALIZE_TABLE[d.rank];
    d.finalize ??= {};
    d.finalize.chakraCostLabel = row.chakraLabel;
    d.finalize.downtimeSolo = row.downtimeSolo ?? undefined;
    d.finalize.downtimeMaster = row.downtimeMaster ?? undefined;
    this.localDraft.set(structuredClone(d));
  }

  persist(): void {
    const { profileId } = this.ids();
    const d = this.localDraft();
    if (!profileId || !d) {
      return;
    }
    const errs = this.rules.validateDraft(d);
    if (errs.length) {
      this.saveMessage.set('Fix validation issues before saving.');
      setTimeout(() => this.saveMessage.set(null), 2400);
      return;
    }
    d.updatedAt = new Date().toISOString();
    this.store.upsertJutsu(profileId, d);
    this.saveMessage.set('Saved');
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
    setTimeout(() => this.saveMessage.set(null), 2200);
  }

  componentOptionsFor(classification: JutsuDraft['classification']): { code: string; label: string }[] {
    if (classification === 'ninjutsu' || classification === 'genjutsu') {
      return [
        { code: 'HS', label: 'Hand Seals (HS)' },
        { code: 'CM', label: 'Chakra Molding (CM)' },
        { code: 'CS', label: 'Chakra Seals (CS)' },
        { code: 'M', label: 'Mobility (M)' },
        { code: 'W', label: 'Weapon (W)' },
        { code: 'NT', label: 'Ninja Tools (NT)' }
      ];
    }
    if (classification === 'taijutsu') {
      return [
        { code: 'CM', label: 'Chakra Molding (CM)' },
        { code: 'M', label: 'Mobility (M)' },
        { code: 'NT', label: 'Ninja Tools (NT)' }
      ];
    }
    return [
      { code: 'CM', label: 'Chakra Molding (CM)' },
      { code: 'M', label: 'Mobility (M)' },
      { code: 'W', label: 'Weapon (W)' },
      { code: 'NT', label: 'Ninja Tools (NT)' }
    ];
  }
}
