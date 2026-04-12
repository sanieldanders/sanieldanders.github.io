import type {
  AbilityAbbr,
  Character,
  CharacterSheetState,
  SkillDot,
  SkillRow
} from '../models/app-data.model';
import { ABILITY_LAYOUT } from './ability-layout';

/** Character with a guaranteed merged sheet (for editing UI). */
export type CharacterWithSheet = Character & { sheet: CharacterSheetState };

function emptySkillRow(): SkillRow {
  return { dot: 'none', mod: '' };
}

function defaultAbilityBlock(
  abbr: AbilityAbbr,
  skills: readonly string[]
): CharacterSheetState['abilities'][AbilityAbbr] {
  const skillsMap: CharacterSheetState['abilities'][AbilityAbbr]['skills'] = {};
  for (const s of skills) {
    skillsMap[s] = emptySkillRow();
  }
  return { score: '', mod: '', skills: skillsMap };
}

export function createDefaultCharacterSheet(): CharacterSheetState {
  const abilities = {} as CharacterSheetState['abilities'];
  for (const row of ABILITY_LAYOUT) {
    abilities[row.abbr] = defaultAbilityBlock(row.abbr, row.skills);
  }
  return {
    rail: {
      proficiencyBonus: '',
      passivePerception: '',
      passiveInsight: '',
      willOfFire: ''
    },
    identity: {
      clan: '',
      playerName: '',
      classLevel: '',
      experiencePoints: ''
    },
    abilities,
    combat: {
      armorClass: '',
      initiative: '',
      speed: '',
      hitPointMax: '',
      chakraPointMax: '',
      currentHitPoints: '',
      currentChakra: '',
      hitDieTotal: '',
      hitDieType: '',
      chakraDieTotal: '',
      chakraDieType: ''
    },
    attacks: Array.from({ length: 8 }, () => ({ name: '', atkBonus: '', damageType: '' })),
    traits: {
      personality: '',
      ideals: '',
      bonds: '',
      flaws: '',
      features: ''
    },
    equipment: ''
  };
}

function coerceDot(v: unknown): SkillDot {
  if (v === 'black' || v === 'red' || v === 'none') {
    return v;
  }
  return 'none';
}

/** Deep-merge saved sheet with defaults so new fields appear safely. */
export function mergeCharacterSheet(saved: Character['sheet'] | undefined): CharacterSheetState {
  const base = createDefaultCharacterSheet();
  if (!saved) {
    return base;
  }
  return {
    rail: { ...base.rail, ...saved.rail },
    identity: { ...base.identity, ...saved.identity },
    abilities: mergeAbilities(base.abilities, saved.abilities),
    combat: { ...base.combat, ...saved.combat },
    attacks: mergeAttacks(base.attacks, saved.attacks),
    traits: { ...base.traits, ...saved.traits },
    equipment: saved.equipment ?? base.equipment
  };
}

export function ensureCharacterSheet(c: Character): CharacterWithSheet {
  return { ...c, sheet: mergeCharacterSheet(c.sheet) };
}

function mergeAbilities(
  base: CharacterSheetState['abilities'],
  saved: CharacterSheetState['abilities'] | undefined
): CharacterSheetState['abilities'] {
  const out = { ...base };
  if (!saved) {
    return out;
  }
  for (const row of ABILITY_LAYOUT) {
    const abbr = row.abbr;
    const b = base[abbr];
    const s = saved[abbr];
    if (!s) {
      continue;
    }
    const skills = { ...b.skills };
    for (const sk of row.skills) {
      const prev = s.skills?.[sk];
      skills[sk] = {
        dot: coerceDot(prev?.dot),
        mod: typeof prev?.mod === 'string' ? prev.mod : ''
      };
    }
    out[abbr] = {
      score: typeof s.score === 'string' ? s.score : b.score,
      mod: typeof s.mod === 'string' ? s.mod : b.mod,
      skills
    };
  }
  return out;
}

function mergeAttacks(
  base: CharacterSheetState['attacks'],
  saved: CharacterSheetState['attacks'] | undefined
): CharacterSheetState['attacks'] {
  if (!saved?.length) {
    return base;
  }
  return base.map((row, i) => ({
    name: typeof saved[i]?.name === 'string' ? saved[i].name : row.name,
    atkBonus: typeof saved[i]?.atkBonus === 'string' ? saved[i].atkBonus : row.atkBonus,
    damageType: typeof saved[i]?.damageType === 'string' ? saved[i].damageType : row.damageType
  }));
}

export function normalizeCharacter(character: Character): CharacterWithSheet {
  return ensureCharacterSheet(character);
}
