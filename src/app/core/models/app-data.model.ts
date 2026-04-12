/** Stored root document in userData (or localStorage fallback). */
export interface AppData {
  profiles: Profile[];
  /** ND&D player characters (basic creator for now). */
  characters: Character[];
}

export type AbilityAbbr = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

/** Skill proficiency pip: empty → black → red → empty (cycle). */
export type SkillDot = 'none' | 'black' | 'red';

export interface SkillRow {
  dot: SkillDot;
  mod: string;
}

export interface AbilitySheet {
  score: string;
  mod: string;
  skills: Record<string, SkillRow>;
}

export interface CharacterSheetState {
  rail: {
    proficiencyBonus: string;
    passivePerception: string;
    passiveInsight: string;
    willOfFire: string;
  };
  identity: {
    clan: string;
    playerName: string;
    classLevel: string;
    experiencePoints: string;
  };
  abilities: Record<AbilityAbbr, AbilitySheet>;
  combat: {
    armorClass: string;
    initiative: string;
    speed: string;
    hitPointMax: string;
    chakraPointMax: string;
    currentHitPoints: string;
    currentChakra: string;
    hitDieTotal: string;
    hitDieType: string;
    chakraDieTotal: string;
    chakraDieType: string;
  };
  attacks: Array<{ name: string; atkBonus: string; damageType: string }>;
  traits: {
    personality: string;
    ideals: string;
    bonds: string;
    flaws: string;
    features: string;
  };
  equipment: string;
}

/** ND&D player character + full sheet state. */
export interface Character {
  id: string;
  name: string;
  createdAt: string;
  /** Present on new saves; older data is patched when loaded. */
  sheet?: CharacterSheetState;
}

export type JutsuClassification = 'ninjutsu' | 'genjutsu' | 'taijutsu' | 'bukijutsu';

export type JutsuRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type JutsuArchetype = 'offensive' | 'defensive' | 'control' | 'support';

/** Free-form effect line the player chose from the rule lists (validated lightly in-app). */
export interface JutsuEffectSelection {
  id: string;
  /** Rule name, e.g. "Damage", "Area", "Blinding". */
  effectKey: string;
  notes?: string;
  /** Extra structured choices (save type, shape, dice pool id, etc.). */
  options?: Record<string, string | number | boolean | string[]>;
}

export interface JutsuPrerequisites {
  hijutsu?: boolean;
  medical?: boolean;
  fuinjutsu?: boolean;
  natureReleases?: string[];
  requiredFeature?: 'none' | 'short_rest' | 'long_rest';
  components?: string[];
  range?: 'self' | 'touch' | 'ranged' | 'inhaled' | 'weapon_range';
  /** Genjutsu sensory keywords */
  sensory?: string[];
  /** Genjutsu tier flags */
  genjutsuTiers?: {
    criticalSuccess: boolean;
    success: boolean;
    failure: boolean;
    criticalFailure: boolean;
  };
  weaponType?: string;
  ninjaTool?: string;
  unaware?: boolean;
}

export interface JutsuDraft {
  id: string;
  name: string;
  classification: JutsuClassification;
  rank: JutsuRank;
  /** Up to two archetypes for effect picking */
  archetypes: JutsuArchetype[];
  conceptNotes?: string;
  prerequisites: JutsuPrerequisites;
  effects: JutsuEffectSelection[];
  finalize?: {
    description?: string;
    chakraCostLabel?: string;
    downtimeSolo?: number;
    downtimeMaster?: number;
  };
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  notes?: string;
  jutsus: JutsuDraft[];
}
