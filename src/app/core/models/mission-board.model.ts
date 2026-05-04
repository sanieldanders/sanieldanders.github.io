export type MissionBoardRank = 'D' | 'C' | 'B' | 'A' | 'S' | 'Special';

export interface MissionBoardEntryRow {
  id: string;
  rank: MissionBoardRank;
  name: string;
  description: string;
  notes: string;
  reward_experience: string;
  reward_ryo: string;
  reward_downtime: string;
  created_at: string;
  created_by: string | null;
}
