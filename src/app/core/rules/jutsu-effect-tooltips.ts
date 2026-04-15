import type { JutsuClassification } from '../models/app-data.model';

/**
 * One-line reminders for HTML `title` tooltips. Keys must match rulebook effect names exactly.
 * Classification-specific lines live in `CLASS_HINTS` (checked first).
 */
const EFFECT_TIPS: Record<string, string> = {
  Area:
    'Adds an AoE; sets one consolidated save for the jutsu and may reduce damage die. Half damage and no rider conditions on a success. Size often grows with rank.',
  Clash: 'Grants the Clash keyword so this jutsu can clash with other Clash jutsu.',
  'Delayed Effect':
    'Repeats another chosen effect next round at a picked turn start. Usually cannot stack with Secondary/Tertiary riders—see your track rules.',
  Lasting:
    'Extends duration (often to 1 min, then concentration up to 10 min). Reactions may become 1 round. Conditions may allow remade saves each turn.',
  Speedy:
    'Bonus-action cast; reduces damage or healing die by 1 if those apply. Second pick: reaction cast and a larger die penalty.',
  Upcast:
    'Upcast rank: +2 damage/healing/shield dice per rank for one pool, or +1 condition rank per rank for one condition.',

  Bleeding:
    'Failed Dex or Con save vs your DC applies Bleeding; needs slashing, piercing, or wind damage where required. Reduces damage die; ranks scale with jutsu rank.',
  Burned: 'Con save vs DC or Burned; needs Fire Release where required. Die penalties and rank scaling per rulebook.',
  Bruising: 'Str or Con save vs DC or Bruised; often tied to Earth on ninjutsu. Die penalties and rank scaling per rulebook.',
  Chilled: 'Con save vs DC or Chilled; needs Water Release where required.',
  Corroded: 'Con save vs DC or Corroded; needs Medical and acid damage on ninjutsu tracks.',
  Critical: 'Each pick widens critical threat range by +1 (extra requirements on some tracks).',
  Damage:
    'Rank-based damage pool from the rulebook; split dice if multiple damage types. Keywords change allowed damage types.',
  'Empowered Damage': 'Requires Damage; increases the damage die step (stack cap per track).',
  Envenoming: 'Con save vs DC or Envenomed; needs Medical where required.',
  'Multiple Strikes': 'Requires Damage; extra attack rolls; split dice across attacks (stack cap differs by track).',
  'Powerful Offense': 'Requires Damage; add ability mod to first or all damage rolls.',
  Shocking: 'Con save vs DC or Shocked; needs Lightning Release where required.',
  Weakening: 'Con save vs DC or Weakened; die penalties scale with rank.',

  'Empowered Shielding': 'Requires Shielding; increases shielding die (stack cap per track).',
  'Damage Reduction': 'Grants DR from a rank-based dice pool; Earth may improve the pool.',
  'Powerful Defense': 'Requires DR or shielding; add ability mod to DR or temp HP rolls.',
  Resistance: 'Grants resistance to one damage type or condition per pick; picks must differ.',
  Shielding: 'Temp HP from a rank-based pool; Lasting is usually required (and tactile on genjutsu).',

  Blinding: 'Failed save vs your DC applies Blinded; sensory or save choices depend on track.',
  Deafening: 'Failed save vs your DC applies Deafened.',
  'Knock Back': 'Failed Str save to resist being pushed; distance bonuses at higher ranks or with Wind.',
  Poisoning: 'Failed Con save vs Poisoned; Medical often required on ninjutsu.',
  Restraining: 'Failed Str, Dex, or Con save (pick at creation) vs Restrained.',
  Sealing:
    'Fuinjutsu rider: usually needs seals + lasting; Charisma save; pick seal outcome (bound rider, lockout, or chakra tax) per rulebook.',
  'Secondary Effect':
    'Adds another conditional without an extra slot; jutsu usually uses a single save. Cannot pair with Delayed Effect where forbidden.',

  Augmentation:
    'Buffs one attack type on attack or damage; damage branch adds a small bonus pool. Needs CM, self/touch, lasting where the track says.',
  'Empowered Healing': 'Requires Healing; increases healing die (stack cap).',
  Enhancing: 'Concentration buff to one ability score per pick; needs self/touch, CM, lasting where required.',
  'Powerful Support': 'Requires Healing; add ability mod to healing rolls.',
  Healing: 'Medical healing pools; usually exclusive with Damage on the same jutsu.',

  'Failure in Success': 'On a non-critical successful save, target still takes a reduced rider (damage, condition, or hindering).',

  'Chakra Damage': 'Taijutsu: deals chakra damage instead of HP with strict prerequisites and die penalties.',
  'Unarmed/Armed': 'Slot-free rider: weave unarmed or weapon damage into the jutsu with a die penalty and pool rules.',

  Dazing: 'Failed Con or Wis save vs DC or Dazed.',

  Berserker: 'Visual/auditory/inhaled genjutsu; mental save or Berserk for the duration.',
  Charming: 'Visual/auditory/inhaled; mental save or Charmed.',
  Concussive: 'Visual/auditory/inhaled; mental save or Concussed.',
  Conditional: 'Only targets already suffering a chosen condition; adds two more control effects with restrictions.',
  'Empowered Hindering': 'After Hindering; deeper penalties to AC, speed, damage, or an ability score by cast rank.',
  Frightening: 'Mental save or Fear ranks.',
  Hindering:
    'Penalizes attacks, saves, checks, or skills; extra picks can widen to all of one category or add another statistic.',
  'Tertiary Effect':
    'Genjutsu: requires two conditions already; adds another without a slot; no Delayed stacking where forbidden.',
  Slowing: 'Sensory genjutsu; mental save or Slow ranks.',
  Maddening: 'Sensory; mental save or Maddened.',
  Dazzling: 'Sensory; mental save or Dazzled.',
  Confusing: 'Sensory; mental save or Confused.',
  'Mind Control': 'High-rank glamor/control with strict sensory prerequisites and severe riders on failed saves.',
  Displacement: 'Visual; failed mental save misplaces where the target believes it stands.',
  Boosting: 'Buff saves, checks, or skills; extra picks widen scope or add another statistic.',
  'Empowered Boosting': 'After Boosting; larger boosts to ability, AC, speed, or damage by cast rank.'
};

const CLASS_HINTS: Partial<Record<`${JutsuClassification}|${string}`, string>> = {
  'genjutsu|Area':
    'AoE uses Int/Wis/Cha save; halves damage and strips rider conditions on success; shape grows with rank.',
  'ninjutsu|Area':
    'AoE uses Str/Dex/Con; halves damage and strips riders on success; Secondary Effect may keep extra saves where noted.',
  'taijutsu|Area': 'AoE uses Str/Dex/Con; interacts with weapon range on bukijutsu when both apply.',
  'bukijutsu|Area': 'AoE uses Str/Dex/Con; combine with weapon range per bukijutsu rules.',

  'genjutsu|Unavoidable':
    'No attack roll; one sensed target makes Int/Wis/Cha save (pick at creation). That save can become the only save for the jutsu.',
  'ninjutsu|Unavoidable': 'Not a standard ninjutsu list effect in this app; see rulebook if your table uses a variant.',
  'taijutsu|Unavoidable':
    'On a hit, applies one rank of a small condition list without a save; reduces damage die (tai/buki style).',
  'bukijutsu|Unavoidable': 'On a hit, applies one rank of a small condition list without a save; reduces damage die.',

  'genjutsu|Damage': 'Psychic damage; tactile is mandatory to deal damage with genjutsu.',
  'genjutsu|Resistance': 'Resistance to Psychic or listed mental-style conditions only.',
  'genjutsu|Shielding': 'Temp HP; requires Lasting and Tactile on genjutsu.',
  'genjutsu|Critical': 'Requires tactile + damage; each pick widens crit range.',

  'genjutsu|Boosting': 'Self/touch + CM + tactile; boosts saves, checks, or skills with rank scaling.',

  'taijutsu|Shielding': 'Self + lasting temp HP pools (taijutsu tables).',
  'bukijutsu|Shielding': 'Self + lasting temp HP pools (bukijutsu tables).',
  'taijutsu|Augmentation': 'Weapon or taijutsu attacks only; still needs CM, self, lasting.',
  'bukijutsu|Augmentation': 'Weapon attacks only; still needs CM, self, lasting.',
  'taijutsu|Boosting': 'Self or touch + CM; no tactile keyword required.',
  'bukijutsu|Boosting': 'Self or touch + CM; no tactile keyword required.',

  'taijutsu|Secondary Effect': 'Extra condition without another slot; single-save limit for the jutsu.',
  'bukijutsu|Secondary Effect': 'Extra condition without another slot; single-save limit for the jutsu.',
  'taijutsu|Knock Back': 'Str save or pushed 15 ft base; extra distance per rank on tai/buki.',
  'bukijutsu|Knock Back': 'Str save or pushed 15 ft base; extra distance per rank on tai/buki.'
};

const DEFAULT_TIP =
  'Rulebook jutsu effect. See your ND&D jutsu creation chapter for prerequisites, saves, and slot costs.';

export function effectTooltip(classification: JutsuClassification, effectKey: string): string {
  const k = (effectKey ?? '').trim();
  if (!k) {
    return '';
  }
  const composite = `${classification}|${k}` as keyof typeof CLASS_HINTS;
  const specific = CLASS_HINTS[composite];
  if (specific) {
    return specific;
  }
  return EFFECT_TIPS[k] ?? DEFAULT_TIP;
}
