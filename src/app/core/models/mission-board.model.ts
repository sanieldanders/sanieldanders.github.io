export type MissionBoardRank = 'D' | 'C' | 'B' | 'A' | 'S' | 'Special';

/** Client-side limits — large payloads slow Supabase round-trips and can appear to hang. */
export const MISSION_BOARD_FIELD_LIMITS = {
  name: 200,
  description: 12_000,
  notes: 12_000,
  reward: 500
} as const;

export interface MissionBoardEntryRow {
  id: string;
  rank: MissionBoardRank;
  name: string;
  description: string;
  notes: string;
  /** Client-only flag; list requests omit large detail fields for fast board loading. */
  details_loaded?: boolean;
  reward_experience: string;
  reward_ryo: string;
  reward_downtime: string;
  created_at: string;
  created_by: string | null;
}
