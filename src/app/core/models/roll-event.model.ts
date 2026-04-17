import type { AbilityAbbr } from './app-data.model';

export type RollEventKind = 'roll' | 'message';

export interface RollEvent {
  id: string;
  kind: RollEventKind;
  characterId: string;
  userId: string;
  userEmail: string;
  skill?: string;
  ability?: AbilityAbbr;
  d20?: number;
  modifier?: number;
  total?: number;
  message?: string;
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

export interface NewChatMessageEvent {
  characterId: string;
  userId: string;
  userEmail: string;
  message: string;
}
