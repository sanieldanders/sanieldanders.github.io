import type { AbilityAbbr } from '../models/app-data.model';

export const ABILITY_LAYOUT: readonly {
  abbr: AbilityAbbr;
  label: string;
  skills: readonly string[];
}[] = [
  { abbr: 'STR', label: 'Strength', skills: ['Saving Throws', 'Athletics', 'Taijutsu'] },
  { abbr: 'DEX', label: 'Dexterity', skills: ['Saving Throws', 'Acrobatics', 'Sleight of Hand', 'Stealth'] },
  { abbr: 'CON', label: 'Constitution', skills: ['Saving Throws', 'Chakra Control'] },
  {
    abbr: 'INT',
    label: 'Intelligence',
    skills: ['Saving Throws', 'Crafting', 'History', 'Investigation', 'Nature', 'Ninjutsu']
  },
  {
    abbr: 'WIS',
    label: 'Wisdom',
    skills: ['Saving Throws', 'Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival', 'Genjutsu']
  },
  {
    abbr: 'CHA',
    label: 'Charisma',
    skills: ['Saving Throws', 'Deception', 'Intimidation', 'Performance', 'Persuasion']
  }
] as const;
