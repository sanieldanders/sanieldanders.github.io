import type { AbilityAbbr } from './app-data.model';

export interface RollEvent {
  id: string;
  characterId: string;
  userId: string;
  userEmail: string;
  skill: string;
  ability: AbilityAbbr;
  d20: number;
  modifier: number;
  total: number;
  createdAt: string;
}

export interface NewRollEvent {
  characterId: string;
  userId: string;
  userEmail: string;
  skill: string;
  ability: AbilityAbbr;
  d20: number;
  modifier: number;
  total: number;
}
