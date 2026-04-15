import type {
  AbilityAbbr,
  Character,
  CharacterJutsuListSheetState,
  CharacterProfileSheetState,
  CharacterSheetState,
  ChakraNature,
  JutsuRank,
  SkillDot,
  SkillRow
} from '../models/app-data.model';
import { JUTSU_LIST_LINES_PER_RANK } from '../models/app-data.model';
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

function defaultNatureSelected(): CharacterProfileSheetState['natureSelected'] {
  return {
    fire: false,
    wind: false,
    lightning: false,
    earth: false,
    water: false
  };
}

const JUTSU_RANKS: JutsuRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

function emptyJutsuRankLines(): string[] {
  return Array.from({ length: JUTSU_LIST_LINES_PER_RANK }, () => '');
}

export function createDefaultJutsuListSheet(): CharacterJutsuListSheetState {
  const ranks = {} as CharacterJutsuListSheetState['ranks'];
  for (const r of JUTSU_RANKS) {
    ranks[r] = emptyJutsuRankLines();
  }
  return {
    ninjutsu: { attackBonus: '', saveDc: '' },
    taijutsu: { attackBonus: '', saveDc: '' },
    genjutsu: { attackBonus: '', saveDc: '' },
    ranks
  };
}

export function createDefaultProfileSheet(): CharacterProfileSheetState {
  return {
    physical: {
      age: '',
      height: '',
      weight: '',
      eyes: '',
      skin: '',
      hair: ''
    },
    appearance: '',
    backstory: '',
    villageRank: '',
    natureSelected: defaultNatureSelected(),
    alliesOrganizations: '',
    additionalFeatures: '',
    capsule: '',
    quadrants: ['', '', '', '']
  };
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
    equipment: '',
    profileSheet: createDefaultProfileSheet(),
    jutsuListSheet: createDefaultJutsuListSheet()
  };
}

function coerceDot(v: unknown): SkillDot {
  if (v === 'black' || v === 'red' || v === 'none') {
    return v;
  }
  return 'none';
}

const NATURE_KEYS: ChakraNature[] = ['fire', 'wind', 'lightning', 'earth', 'water'];

function mergeNatureSelected(
  base: CharacterProfileSheetState['natureSelected'],
  saved: CharacterProfileSheetState['natureSelected'] | undefined
): CharacterProfileSheetState['natureSelected'] {
  const out = { ...base };
  if (!saved) {
    return out;
  }
  for (const k of NATURE_KEYS) {
    if (typeof saved[k] === 'boolean') {
      out[k] = saved[k];
    }
  }
  return out;
}

function mergeQuadrants(
  base: CharacterProfileSheetState['quadrants'],
  saved: CharacterProfileSheetState['quadrants'] | undefined
): CharacterProfileSheetState['quadrants'] {
  if (!Array.isArray(saved) || saved.length !== 4) {
    return base;
  }
  return saved.map((q, i) => (typeof q === 'string' ? q : base[i])) as CharacterProfileSheetState['quadrants'];
}

function mergePhysical(
  base: CharacterProfileSheetState['physical'],
  saved: CharacterProfileSheetState['physical'] | undefined
): CharacterProfileSheetState['physical'] {
  if (!saved) {
    return base;
  }
  const pick = (k: keyof CharacterProfileSheetState['physical']): string =>
    typeof saved[k] === 'string' ? saved[k] : base[k];
  return {
    age: pick('age'),
    height: pick('height'),
    weight: pick('weight'),
    eyes: pick('eyes'),
    skin: pick('skin'),
    hair: pick('hair')
  };
}

function mergeJutsuTypeBlock(
  base: CharacterJutsuListSheetState['ninjutsu'],
  saved: CharacterJutsuListSheetState['ninjutsu'] | undefined
): CharacterJutsuListSheetState['ninjutsu'] {
  if (!saved) {
    return base;
  }
  return {
    attackBonus: typeof saved.attackBonus === 'string' ? saved.attackBonus : base.attackBonus,
    saveDc: typeof saved.saveDc === 'string' ? saved.saveDc : base.saveDc
  };
}

function mergeRankLines(base: string[], saved: string[] | undefined): string[] {
  if (!Array.isArray(saved)) {
    return base;
  }
  return base.map((_, i) => (typeof saved[i] === 'string' ? saved[i] : ''));
}

function mergeJutsuListSheet(
  base: CharacterJutsuListSheetState,
  saved: CharacterJutsuListSheetState | undefined
): CharacterJutsuListSheetState {
  if (!saved) {
    return base;
  }
  const ranks = { ...base.ranks };
  for (const r of JUTSU_RANKS) {
    ranks[r] = mergeRankLines(base.ranks[r], saved.ranks?.[r]);
  }
  return {
    ninjutsu: mergeJutsuTypeBlock(base.ninjutsu, saved.ninjutsu),
    taijutsu: mergeJutsuTypeBlock(base.taijutsu, saved.taijutsu),
    genjutsu: mergeJutsuTypeBlock(base.genjutsu, saved.genjutsu),
    ranks
  };
}

function mergeProfileSheet(
  base: CharacterProfileSheetState,
  saved: CharacterProfileSheetState | undefined
): CharacterProfileSheetState {
  if (!saved) {
    return base;
  }
  return {
    physical: mergePhysical(base.physical, saved.physical),
    appearance: typeof saved.appearance === 'string' ? saved.appearance : base.appearance,
    backstory: typeof saved.backstory === 'string' ? saved.backstory : base.backstory,
    villageRank: typeof saved.villageRank === 'string' ? saved.villageRank : base.villageRank,
    natureSelected: mergeNatureSelected(base.natureSelected, saved.natureSelected),
    alliesOrganizations:
      typeof saved.alliesOrganizations === 'string' ? saved.alliesOrganizations : base.alliesOrganizations,
    additionalFeatures:
      typeof saved.additionalFeatures === 'string' ? saved.additionalFeatures : base.additionalFeatures,
    capsule: typeof saved.capsule === 'string' ? saved.capsule : base.capsule,
    quadrants: mergeQuadrants(base.quadrants, saved.quadrants)
  };
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
    equipment: saved.equipment ?? base.equipment,
    profileSheet: mergeProfileSheet(base.profileSheet, saved.profileSheet),
    jutsuListSheet: mergeJutsuListSheet(base.jutsuListSheet, saved.jutsuListSheet)
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
