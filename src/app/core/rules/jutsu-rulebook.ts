import type {
  JutsuArchetype,
  JutsuClassification,
  JutsuDraft,
  JutsuEffectSelection,
  JutsuPrerequisites,
  JutsuRank
} from '../models/app-data.model';

/** Nature releases selectable when using the Nature Release prerequisite (rulebook). */
export const NATURE_RELEASE_OPTIONS = [
  { id: 'Earth Release', label: 'Earth Release' },
  { id: 'Wind Release', label: 'Wind Release' },
  { id: 'Fire Release', label: 'Fire Release' },
  { id: 'Water Release', label: 'Water Release' },
  { id: 'Lightning Release', label: 'Lightning Release' }
] as const;

export type NatureReleaseId = (typeof NATURE_RELEASE_OPTIONS)[number]['id'];

/** Genjutsu sensory keywords (rulebook). */
export const GENJUTSU_SENSORY_OPTIONS = [
  { id: 'Visual', label: 'Visual' },
  { id: 'Tactile', label: 'Tactile' },
  { id: 'Auditory', label: 'Auditory' },
  { id: 'Inhaled', label: 'Inhaled' }
] as const;

export type GenjutsuSensoryId = (typeof GENJUTSU_SENSORY_OPTIONS)[number]['id'];

/** Common weapon types when the Weapon (W) component is selected. */
export const WEAPON_TYPE_OPTIONS = [
  'Unarmed strike',
  'Simple melee',
  'Martial melee',
  'Simple ranged',
  'Martial ranged',
  'Thrown'
] as const;

/** Common ninja tools when Ninja Tools (NT) is selected. */
export const NINJA_TOOL_OPTIONS = [
  'Kunai',
  'Shuriken',
  'Senbon',
  'Smoke bomb',
  'Explosive tag',
  'Wire',
  'Other (describe in notes)'
] as const;

export const COMPONENT_CODES = {
  HS: 'Hand Seals (HS)',
  CM: 'Chakra Molding (CM)',
  CS: 'Chakra Seals (CS)',
  M: 'Mobility (M)',
  W: 'Weapon (W)',
  NT: 'Ninja Tools (NT)'
} as const;

export type ComponentCode = keyof typeof COMPONENT_CODES;

/** Final chakra label and downtime by rank (creating / finalizing a jutsu). */
export const RANK_FINALIZE_TABLE: Record<
  JutsuRank,
  { chakraLabel: string; downtimeSolo: number | null; downtimeMaster: number | null }
> = {
  E: { chakraLabel: 'Special (2 Chakra)', downtimeSolo: 1, downtimeMaster: null },
  D: { chakraLabel: 'Special (4 Chakra)', downtimeSolo: 3, downtimeMaster: 2 },
  C: { chakraLabel: 'Special (7 Chakra)', downtimeSolo: 5, downtimeMaster: 4 },
  B: { chakraLabel: 'Special (12 Chakra)', downtimeSolo: 10, downtimeMaster: 8 },
  A: { chakraLabel: 'Special (17 Chakra)', downtimeSolo: 15, downtimeMaster: 12 },
  S: { chakraLabel: 'Special (25 Chakra)', downtimeSolo: 25, downtimeMaster: 20 }
};

/** Damage effect: allowed die pools by rank (rulebook). E-Rank uses D-Rank pools. */
const NINJUTSU_DAMAGE_DICE: Record<'D' | 'C' | 'B' | 'A' | 'S', readonly string[]> = {
  D: ['6d4', '5d6', '4d8', '3d10', '2d12'],
  C: ['10d4', '8d6', '6d8', '5d10', '4d12'],
  B: ['12d6', '9d8', '7d10', '6d12'],
  A: ['15d6', '11d8', '9d10', '7d12'],
  S: ['20d6', '15d8', '12d10', '10d12']
};

const GENJUTSU_DAMAGE_DICE: Record<'D' | 'C' | 'B' | 'A' | 'S', readonly string[]> = {
  D: ['5d4', '4d6', '3d8', '2d10'],
  C: ['8d4', '5d6', '4d8', '3d10', '2d12'],
  B: ['12d4', '8d6', '6d8', '4d10', '3d12'],
  A: ['16d4', '12d6', '9d8', '7d10', '5d12'],
  S: ['20d4', '15d6', '12d8', '9d10', '7d12']
};

const TAI_BUKI_DAMAGE_DICE: Record<'D' | 'C' | 'B' | 'A' | 'S', readonly string[]> = {
  D: ['6d4', '4d6', '3d8', '2d10'],
  C: ['8d4', '5d6', '4d8', '3d10', '2d12'],
  B: ['7d6', '5d8', '5d10', '4d12'],
  A: ['10d6', '8d8', '8d10', '6d12'],
  S: ['12d8', '10d10', '8d12']
};

/** Options key for the chosen damage die pool on a Damage effect row. */
export const DAMAGE_DICE_OPTION_KEY = 'damageDice' as const;

/** Effective rank for damage tables (E uses D-Rank pools). */
export function damageTableRank(rank: JutsuRank): 'D' | 'C' | 'B' | 'A' | 'S' {
  return rank === 'E' ? 'D' : rank;
}

export function damageDiceOptions(classification: JutsuClassification, rank: JutsuRank): readonly string[] {
  const r = damageTableRank(rank);
  if (classification === 'ninjutsu') {
    return NINJUTSU_DAMAGE_DICE[r];
  }
  if (classification === 'genjutsu') {
    return GENJUTSU_DAMAGE_DICE[r];
  }
  return TAI_BUKI_DAMAGE_DICE[r];
}

export function getEffectDamageDice(effect: JutsuEffectSelection): string | undefined {
  const v = effect.options?.[DAMAGE_DICE_OPTION_KEY];
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

const NINJUTSU_UNIVERSAL = [
  'Area',
  'Clash',
  'Delayed Effect',
  'Lasting',
  'Speedy',
  'Upcast'
] as const;

const NINJUTSU_BY_ARCHETYPE: Record<JutsuArchetype, readonly string[]> = {
  offensive: [
    'Bleeding',
    'Burned',
    'Bruising',
    'Chilled',
    'Corroded',
    'Critical',
    'Damage',
    'Empowered Damage',
    'Envenoming',
    'Multiple Strikes',
    'Powerful Offense',
    'Shocking',
    'Weakening'
  ],
  defensive: [
    'Empowered Shielding',
    'Damage Reduction',
    'Powerful Defense',
    'Resistance',
    'Shielding'
  ],
  control: [
    'Blinding',
    'Deafening',
    'Knock Back',
    'Poisoning',
    'Restraining',
    'Sealing',
    'Secondary Effect'
  ],
  support: [
    'Augmentation',
    'Empowered Healing',
    'Enhancing',
    'Powerful Support',
    'Healing'
  ]
};

const GENJUTSU_UNIVERSAL = [
  'Area',
  'Delayed Effect',
  'Lasting',
  'Speedy',
  'Failure in Success',
  'Upcast',
  'Unavoidable'
] as const;

const GENJUTSU_BY_ARCHETYPE: Record<JutsuArchetype, readonly string[]> = {
  offensive: ['Critical', 'Damage', 'Empowered Damage', 'Multiple Strikes', 'Powerful Offense'],
  defensive: ['Empowered Shielding', 'Resistance', 'Shielding'],
  control: [
    'Blinding',
    'Berserker',
    'Charming',
    'Concussive',
    'Conditional',
    'Deafening',
    'Empowered Hindering',
    'Frightening',
    'Hindering',
    'Restraining',
    'Sealing',
    'Slowing',
    'Tertiary Effect',
    'Weakening',
    'Maddening',
    'Dazzling',
    'Confusing',
    'Mind Control',
    'Displacement'
  ],
  support: ['Augmentation', 'Boosting', 'Empowered Boosting']
};

const TAI_BUKI_UNIVERSAL = [
  'Area',
  'Clash',
  'Delayed Effect',
  'Lasting',
  'Speedy',
  'Upcast'
] as const;

const TAI_BUKI_BY_ARCHETYPE: Record<JutsuArchetype, readonly string[]> = {
  offensive: [
    'Bleeding',
    'Burned',
    'Bruising',
    'Chilled',
    'Corroded',
    'Critical',
    'Damage',
    'Chakra Damage',
    'Empowered Damage',
    'Envenoming',
    'Multiple Strikes',
    'Shocking',
    'Unavoidable',
    'Weakening',
    'Unarmed/Armed'
  ],
  defensive: ['Empowered Shielding', 'Shielding'],
  control: [
    'Blinding',
    'Dazing',
    'Deafening',
    'Knock Back',
    'Poisoning',
    'Restraining',
    'Secondary Effect'
  ],
  support: ['Augmentation', 'Boosting', 'Empowered Boosting']
};

const VALID_NATURE_IDS = new Set<string>(NATURE_RELEASE_OPTIONS.map((o) => o.id));
const VALID_SENSORY_IDS = new Set<string>(GENJUTSU_SENSORY_OPTIONS.map((o) => o.id));

function uniqSorted(keys: string[]): string[] {
  return [...new Set(keys)].sort((a, b) => a.localeCompare(b));
}

/** Canonical effect names allowed for this classification and chosen archetypes (≤2). */
export function allowedEffectKeys(classification: JutsuClassification, archetypes: JutsuArchetype[]): string[] {
  if (archetypes.length === 0) {
    return [];
  }
  let universal: readonly string[];
  let byArch: Record<JutsuArchetype, readonly string[]>;
  if (classification === 'ninjutsu') {
    universal = NINJUTSU_UNIVERSAL;
    byArch = NINJUTSU_BY_ARCHETYPE;
  } else if (classification === 'genjutsu') {
    universal = GENJUTSU_UNIVERSAL;
    byArch = GENJUTSU_BY_ARCHETYPE;
  } else {
    universal = TAI_BUKI_UNIVERSAL;
    byArch = TAI_BUKI_BY_ARCHETYPE;
  }
  const set = new Set<string>([...universal]);
  for (const a of archetypes) {
    for (const k of byArch[a]) {
      if (classification === 'bukijutsu' && k === 'Chakra Damage') {
        continue;
      }
      set.add(k);
    }
  }
  return uniqSorted([...set]);
}

function hasComponent(prereq: JutsuPrerequisites, code: string): boolean {
  return (prereq.components ?? []).includes(code);
}

function effectKeysList(effects: JutsuDraft['effects']): string[] {
  return effects.map((e) => (e.effectKey ?? '').trim()).filter(Boolean);
}

/** Full rules pass for the editor (strict lists + mandatory components). */
export function validateJutsuDraft(d: JutsuDraft, maxEffectSlots: number): string[] {
  const issues: string[] = [];

  if (!d.name?.trim()) {
    issues.push('Name is required.');
  }

  if (d.archetypes.length === 0) {
    issues.push('Pick at least one archetype (Offensive, Defensive, Control, or Support).');
  } else if (d.archetypes.length > 2) {
    issues.push('You may pick at most two archetypes.');
  }

  if (d.rank === 'E' && d.prerequisites.requiredFeature && d.prerequisites.requiredFeature !== 'none') {
    issues.push('E-Rank jutsu cannot use Required Feature (short or long rest).');
  }

  const prereq = d.prerequisites;
  const comps = prereq.components ?? [];

  if (comps.length < 1) {
    issues.push('Your jutsu must have at least one Component.');
  }

  if (d.classification === 'ninjutsu') {
    if (!hasComponent(prereq, 'HS')) {
      issues.push('Ninjutsu: Hand Seals (HS) are mandatory for all created Ninjutsu.');
    }
    if (prereq.natureReleases?.length && !hasComponent(prereq, 'CM')) {
      issues.push('Ninjutsu: Chakra Molding (CM) is mandatory when using Nature Release.');
    }
    if (prereq.medical && !hasComponent(prereq, 'CM')) {
      issues.push('Ninjutsu: Chakra Molding (CM) is mandatory with Medical.');
    }
    if (prereq.fuinjutsu && !hasComponent(prereq, 'CS')) {
      issues.push('Ninjutsu: Chakra Seals (CS) are mandatory with Fuinjutsu.');
    }
    if (hasComponent(prereq, 'NT')) {
      const r = prereq.range;
      if (r !== 'self' && r !== 'touch') {
        issues.push('Ninjutsu: Ninja Tools (NT) requires range Self or Touch.');
      }
    }
  }

  if (d.classification === 'genjutsu') {
    if (!hasComponent(prereq, 'HS')) {
      issues.push('Genjutsu: Hand Seals (HS) are mandatory for all created Genjutsu.');
    }
    if (!hasComponent(prereq, 'CM')) {
      issues.push('Genjutsu: Chakra Molding (CM) is mandatory for all created Genjutsu.');
    }
    if (prereq.fuinjutsu && !hasComponent(prereq, 'CS')) {
      issues.push('Genjutsu: Chakra Seals (CS) are mandatory with Fuinjutsu.');
    }
    if (hasComponent(prereq, 'W')) {
      const r = prereq.range;
      if (r !== 'self' && r !== 'touch') {
        issues.push('Genjutsu: Weapon (W) requires range Self or Touch.');
      }
    }
    if (hasComponent(prereq, 'NT')) {
      const r = prereq.range;
      if (r !== 'self' && r !== 'touch') {
        issues.push('Genjutsu: Ninja Tools (NT) requires range Self or Touch.');
      }
    }
    if (prereq.range === 'inhaled' && !hasComponent(prereq, 'NT')) {
      issues.push('Genjutsu: Inhaled range requires Ninja Tools (NT) per sensory/range rules.');
    }
    const tiers = prereq.genjutsuTiers;
    if (tiers) {
      if (!tiers.criticalSuccess || !tiers.success || !tiers.failure) {
        issues.push(
          'Genjutsu: If the jutsu uses save tiers, Critical Success, Success, and Failure are all mandatory.'
        );
      }
    }
  }

  if (d.classification === 'taijutsu' || d.classification === 'bukijutsu') {
    if (!hasComponent(prereq, 'M')) {
      issues.push('Taijutsu/Bukijutsu: Mobility (M) is mandatory.');
    }
    if (d.classification === 'bukijutsu' && !hasComponent(prereq, 'W')) {
      issues.push('Bukijutsu: Weapon (W) is mandatory.');
    }
    if (prereq.natureReleases?.length && !hasComponent(prereq, 'CM')) {
      issues.push('Taijutsu/Bukijutsu: Chakra Molding (CM) is mandatory when using Nature Release.');
    }
    if (d.classification === 'taijutsu' && prereq.range === 'weapon_range') {
      issues.push('Taijutsu: Weapon Range cannot be used for Taijutsu (only Bukijutsu).');
    }
  }

  if (prereq.natureReleases?.length) {
    for (const nr of prereq.natureReleases) {
      if (!VALID_NATURE_IDS.has(nr)) {
        issues.push(
          `Nature Release must be one of: ${[...VALID_NATURE_IDS].join(', ')}. Unknown: "${nr}".`
        );
      }
    }
  }

  if (d.classification === 'genjutsu' && prereq.sensory?.length) {
    for (const s of prereq.sensory) {
      if (!VALID_SENSORY_IDS.has(s)) {
        issues.push(
          `Genjutsu sensory keywords must be from: ${[...VALID_SENSORY_IDS].join(', ')}. Unknown: "${s}".`
        );
      }
    }
  }

  if (hasComponent(prereq, 'W') && !prereq.weaponType?.trim()) {
    issues.push('Select a weapon type when Weapon (W) is checked (rulebook: pick one weapon type).');
  }

  if (hasComponent(prereq, 'NT') && !prereq.ninjaTool?.trim()) {
    issues.push('Select or name a ninja tool when Ninja Tools (NT) is checked.');
  }

  const keys = effectKeysList(d.effects);
  if (keys.length !== d.effects.filter((e) => e.effectKey?.trim()).length) {
    issues.push('Every effect row must have an effect selected from the rulebook list.');
  }

  const allowed = new Set(allowedEffectKeys(d.classification, d.archetypes));
  for (const k of keys) {
    if (!allowed.has(k)) {
      issues.push(
        `Effect "${k}" is not allowed for ${d.classification} with your archetypes. Pick from the dropdown list.`
      );
    }
  }

  const damagePools = new Set(damageDiceOptions(d.classification, d.rank));
  d.effects.forEach((eff, index) => {
    if (eff.effectKey?.trim() !== 'Damage') {
      return;
    }
    const chosen = getEffectDamageDice(eff);
    if (!chosen || !damagePools.has(chosen)) {
      issues.push(
        `Damage effect #${index + 1}: select a valid damage die pool for ${d.classification} at rank ${d.rank} (E-Rank uses D-Rank pools).`
      );
    }
  });

  if (d.classification === 'ninjutsu' || d.classification === 'taijutsu' || d.classification === 'bukijutsu') {
    if (keys.includes('Delayed Effect') && keys.includes('Secondary Effect')) {
      issues.push('Secondary Effect and Delayed Effect cannot be taken together (they do not stack).');
    }
  }

  if (d.classification === 'genjutsu') {
    if (keys.includes('Delayed Effect') && keys.includes('Tertiary Effect')) {
      issues.push('Tertiary Effect and Delayed Effect cannot be taken together (they do not stack).');
    }
  }

  if (d.effects.length > maxEffectSlots) {
    issues.push(
      `Effect slots: ${d.effects.length} chosen but only ${maxEffectSlots} are available for this rank and prerequisites.`
    );
  }

  const genjutsuDamage = keys.includes('Damage');
  if (d.classification === 'genjutsu' && genjutsuDamage) {
    if (!prereq.sensory?.includes('Tactile')) {
      issues.push('Genjutsu: Damage requires the Tactile sensory keyword.');
    }
  }

  const genjutsuCritical = keys.includes('Critical');
  if (d.classification === 'genjutsu' && genjutsuCritical && !genjutsuDamage) {
    issues.push('Genjutsu: Critical requires the Damage effect and Tactile (per rulebook).');
  }

  if (d.classification === 'ninjutsu' || d.classification === 'taijutsu' || d.classification === 'bukijutsu') {
    if (keys.includes('Healing') && keys.includes('Damage')) {
      issues.push('Healing cannot be taken together with Damage on this jutsu (rulebook).');
    }
  }

  if (d.classification === 'ninjutsu' && keys.includes('Healing') && !prereq.medical) {
    issues.push('Ninjutsu: Healing requires the Medical prerequisite keyword.');
  }

  if (d.classification === 'ninjutsu' && keys.includes('Shielding') && !keys.includes('Lasting')) {
    issues.push('Ninjutsu: Shielding requires the Lasting effect.');
  }

  if (d.classification === 'taijutsu' || d.classification === 'bukijutsu') {
    if (keys.includes('Shielding')) {
      if (prereq.range !== 'self') {
        issues.push('Taijutsu/Bukijutsu: Shielding requires range Self.');
      }
      if (!keys.includes('Lasting')) {
        issues.push('Taijutsu/Bukijutsu: Shielding requires the Lasting effect.');
      }
    }
  }

  if (d.classification === 'genjutsu') {
    if (keys.includes('Shielding')) {
      if (!keys.includes('Lasting')) {
        issues.push('Genjutsu: Shielding requires the Lasting effect.');
      }
      if (!prereq.sensory?.includes('Tactile')) {
        issues.push('Genjutsu: Shielding requires the Tactile sensory keyword.');
      }
    }
    if (keys.includes('Resistance') && !prereq.sensory?.includes('Tactile')) {
      issues.push('Genjutsu: Resistance requires the Tactile sensory keyword.');
    }
    if (keys.includes('Empowered Shielding') && !keys.includes('Shielding')) {
      issues.push('Genjutsu: Empowered Shielding requires the Shielding effect.');
    }
    if (keys.includes('Boosting')) {
      const r = prereq.range;
      if (r !== 'self' && r !== 'touch') {
        issues.push('Genjutsu: Boosting requires range Self or Touch.');
      }
      if (!hasComponent(prereq, 'CM')) {
        issues.push('Genjutsu: Boosting requires Chakra Molding (CM).');
      }
      if (!prereq.sensory?.includes('Tactile')) {
        issues.push('Genjutsu: Boosting requires the Tactile sensory keyword.');
      }
    }
    if (keys.includes('Empowered Boosting') && !keys.includes('Boosting')) {
      issues.push('Genjutsu: Empowered Boosting requires the Boosting effect.');
    }
    if (keys.includes('Augmentation')) {
      if (!hasComponent(prereq, 'CM')) {
        issues.push('Genjutsu: Augmentation requires Chakra Molding (CM).');
      }
      const r = prereq.range;
      if (r !== 'self' && r !== 'touch') {
        issues.push('Genjutsu: Augmentation requires range Self or Touch.');
      }
      if (!keys.includes('Lasting')) {
        issues.push('Genjutsu: Augmentation requires the Lasting effect.');
      }
    }
    if (keys.includes('Sealing')) {
      if (!prereq.fuinjutsu) {
        issues.push('Genjutsu: Sealing requires the Fuinjutsu prerequisite keyword.');
      }
      if (prereq.range !== 'touch') {
        issues.push('Genjutsu: Sealing requires range Touch.');
      }
      if (!hasComponent(prereq, 'CS')) {
        issues.push('Genjutsu: Sealing requires Chakra Seals (CS).');
      }
      if (!keys.includes('Lasting')) {
        issues.push('Genjutsu: Sealing requires the Lasting effect.');
      }
    }
  }

  if (d.classification === 'ninjutsu') {
    if (keys.includes('Augmentation')) {
      if (!hasComponent(prereq, 'CM')) {
        issues.push('Ninjutsu: Augmentation requires Chakra Molding (CM).');
      }
      const r = prereq.range;
      if (r !== 'self' && r !== 'touch') {
        issues.push('Ninjutsu: Augmentation requires range Self or Touch.');
      }
      if (!keys.includes('Lasting')) {
        issues.push('Ninjutsu: Augmentation requires the Lasting effect.');
      }
    }
    if (keys.includes('Enhancing')) {
      if (!hasComponent(prereq, 'CM')) {
        issues.push('Ninjutsu: Enhancing requires Chakra Molding (CM).');
      }
      const r = prereq.range;
      if (r !== 'self' && r !== 'touch') {
        issues.push('Ninjutsu: Enhancing requires range Self or Touch.');
      }
      if (!keys.includes('Lasting')) {
        issues.push('Ninjutsu: Enhancing requires the Lasting effect.');
      }
    }
    if (keys.includes('Powerful Support') && !keys.includes('Healing')) {
      issues.push('Ninjutsu: Powerful Support requires the Healing effect.');
    }
    if (keys.includes('Sealing')) {
      if (!prereq.fuinjutsu) {
        issues.push('Ninjutsu: Sealing requires the Fuinjutsu prerequisite keyword.');
      }
      if (!hasComponent(prereq, 'CS')) {
        issues.push('Ninjutsu: Sealing requires Chakra Seals (CS).');
      }
      if (!keys.includes('Lasting')) {
        issues.push('Ninjutsu: Sealing requires the Lasting effect.');
      }
    }
    if (keys.includes('Empowered Healing') && !keys.includes('Healing')) {
      issues.push('Ninjutsu: Empowered Healing requires the Healing effect.');
    }
  }

  if (d.classification === 'taijutsu' || d.classification === 'bukijutsu') {
    if (keys.includes('Augmentation')) {
      if (!hasComponent(prereq, 'CM')) {
        issues.push('Taijutsu/Bukijutsu: Augmentation requires Chakra Molding (CM).');
      }
      if (prereq.range !== 'self') {
        issues.push('Taijutsu/Bukijutsu: Augmentation requires range Self.');
      }
      if (!keys.includes('Lasting')) {
        issues.push('Taijutsu/Bukijutsu: Augmentation requires the Lasting effect.');
      }
    }
    if (keys.includes('Boosting')) {
      const r = prereq.range;
      if (r !== 'self' && r !== 'touch') {
        issues.push('Taijutsu/Bukijutsu: Boosting requires range Self or Touch.');
      }
      if (!hasComponent(prereq, 'CM')) {
        issues.push('Taijutsu/Bukijutsu: Boosting requires Chakra Molding (CM).');
      }
    }
    if (keys.includes('Empowered Boosting') && !keys.includes('Boosting')) {
      issues.push('Taijutsu/Bukijutsu: Empowered Boosting requires the Boosting effect.');
    }
    if (d.classification === 'taijutsu' && keys.includes('Chakra Damage')) {
      if (prereq.range !== 'touch') {
        issues.push('Taijutsu: Chakra Damage requires range Touch.');
      }
      if (!hasComponent(prereq, 'CM')) {
        issues.push('Taijutsu: Chakra Damage requires Chakra Molding (CM).');
      }
      if (!keys.includes('Damage')) {
        issues.push('Taijutsu: Chakra Damage requires the Damage effect.');
      }
    }
    if (keys.includes('Unarmed/Armed')) {
      if (!keys.includes('Damage') && !keys.includes('Shielding')) {
        issues.push('Unarmed/Armed requires the Damage or Shielding effect.');
      }
    }
  }

  if (keys.includes('Empowered Damage') && !keys.includes('Damage')) {
    issues.push('Empowered Damage requires the Damage effect.');
  }

  if (
    (d.classification === 'ninjutsu' || d.classification === 'taijutsu' || d.classification === 'bukijutsu') &&
    keys.includes('Multiple Strikes') &&
    !keys.includes('Damage')
  ) {
    issues.push('Multiple Strikes requires the Damage effect.');
  }

  if (
    (d.classification === 'ninjutsu' || d.classification === 'taijutsu' || d.classification === 'bukijutsu') &&
    keys.includes('Powerful Offense') &&
    !keys.includes('Damage')
  ) {
    issues.push('Powerful Offense requires the Damage effect.');
  }

  if (d.classification === 'genjutsu') {
    if (keys.includes('Multiple Strikes') && !keys.includes('Damage')) {
      issues.push('Genjutsu: Multiple Strikes requires the Damage effect.');
    }
    if (keys.includes('Powerful Offense') && !keys.includes('Damage')) {
      issues.push('Genjutsu: Powerful Offense requires the Damage effect.');
    }
  }

  return issues;
}

/** Short in-app rule reminders for this jutsu’s classification (plain text). */
export function rulebookSummaryParagraphs(classification: JutsuClassification): string[] {
  const shared: string[] = [
    'Creating a jutsu: you define effects, potency, chakra cost, and requirements (clan features, affinities, etc.). Learning a jutsu uses separate downtime costs.',
    'Step one — concept: Ninjutsu (chakra shaping vs world/creatures), Taijutsu (body martial arts), Genjutsu (sensory illusion). Pick rank first; it caps effect slots and final cost.',
    'Learning downtime (self-taught / master): E 1/— · D 3/2 · C 6/4 · B 12/8 · A 20/16 · S 40/24.',
    'Maximum effects by rank: E 1 · D 4 · C 5 · B 6 · A 7 · S 8.'
  ];

  if (classification === 'ninjutsu') {
    return [
      ...shared,
      'Ninjutsu step two: prerequisite keywords (Hijutsu clan-only, Medical, Fuinjutsu, Nature Release, Required Feature — not on E-Rank). Components: at least one; Hand Seals (HS) always; Chakra Molding (CM) with Nature Release and with Medical; Chakra Seals (CS) with Fuinjutsu; Ninja Tools (NT) only with Self or Touch range.',
      'Ninjutsu step three: choose at most two of Offensive, Defensive, Control, Support; pick effects only from those lists plus universal effects (Area, Clash, Delayed Effect, Lasting, Speedy, Upcast). Secondary Effect and Delayed Effect do not stack.',
      'Finalize: set name, chakra label, and downtime from the rank table (e.g. D-Rank Special (4 Chakra), solo 3 / master 2).'
    ];
  }
  if (classification === 'genjutsu') {
    return [
      ...shared,
      'Genjutsu step two: Hand Seals (HS) and Chakra Molding (CM) mandatory; Chakra Seals (CS) with Fuinjutsu; Weapon (W) and Ninja Tools (NT) only with Self or Touch; Inhaled range requires NT. Sensory keywords: Visual, Tactile, Auditory, Inhaled. Unaware costs 1 effect slot. Save tiers: Critical Success, Success, and Failure are mandatory when saves apply.',
      'Genjutsu step three: at most two archetypes; universal effects include Area, Delayed Effect, Lasting, Speedy, Failure in Success, Upcast, Unavoidable. Damage requires Tactile; Critical requires Damage and Tactile. Tertiary Effect and Delayed Effect do not stack.',
      'Finalize: chakra and downtime from the rank table as for ninjutsu.'
    ];
  }
  return [
    ...shared,
    'Taijutsu / Bukijutsu step two: Mobility (M) mandatory; Weapon (W) mandatory for Bukijutsu; Chakra Molding (CM) mandatory with Nature Release. Weapon Range is Bukijutsu-only.',
    'Step three: at most two archetypes; universal effects include Area, Clash, Delayed Effect, Lasting, Speedy, Upcast. Secondary Effect and Delayed Effect do not stack.',
    'Finalize: chakra and downtime from the rank table as for ninjutsu.'
  ];
}
