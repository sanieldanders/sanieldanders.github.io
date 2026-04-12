import { Injectable } from '@angular/core';
import type { JutsuClassification, JutsuDraft, JutsuPrerequisites, JutsuRank } from '../models/app-data.model';
import { validateJutsuDraft } from '../rules/jutsu-rulebook';

/** Table: JUTSU RANK EFFECT SLOTS (your rules text). */
const BASE_EFFECT_SLOTS: Record<JutsuRank, number> = {
  E: 1,
  D: 4,
  C: 5,
  B: 6,
  A: 7,
  S: 8
};

@Injectable({ providedIn: 'root' })
export class JutsuRulesService {
  baseEffectSlots(rank: JutsuRank): number {
    return BASE_EFFECT_SLOTS[rank];
  }

  prerequisiteBonusSlots(prereq: JutsuPrerequisites): number {
    if (prereq.requiredFeature === 'short_rest') {
      return 1;
    }
    if (prereq.requiredFeature === 'long_rest') {
      return 2;
    }
    return 0;
  }

  /** Genjutsu: if requiring a save, Critical Success is mandatory; missing it costs 1 slot (per rules). */
  genjutsuTierSlotDelta(tiers: JutsuPrerequisites['genjutsuTiers']): number {
    if (!tiers) {
      return 0;
    }
    let delta = 0;
    if (!tiers.criticalSuccess) {
      delta -= 1;
    }
    if (!tiers.criticalFailure) {
      delta += 1;
    }
    return delta;
  }

  unawareSlotCost(prereq: JutsuPrerequisites): number {
    return prereq.unaware ? 1 : 0;
  }

  maxEffectSlots(rank: JutsuRank, classification: JutsuClassification, prereq: JutsuPrerequisites): number {
    let total =
      this.baseEffectSlots(rank) +
      this.prerequisiteBonusSlots(prereq) -
      this.unawareSlotCost(prereq);

    if (classification === 'genjutsu') {
      total += this.genjutsuTierSlotDelta(prereq.genjutsuTiers);
    }

    return Math.max(0, total);
  }

  validateArchetypes(archetypes: string[]): string | null {
    if (archetypes.length === 0) {
      return 'Pick at least one archetype (Offensive, Defensive, Control, or Support).';
    }
    if (archetypes.length > 2) {
      return 'You may pick at most two archetypes.';
    }
    return null;
  }

  /** Full validation: components, prerequisites, effect legality, exclusivity, and slot budget. */
  validateDraft(draft: JutsuDraft): string[] {
    const max = this.maxEffectSlots(draft.rank, draft.classification, draft.prerequisites);
    return validateJutsuDraft(draft, max);
  }
}
