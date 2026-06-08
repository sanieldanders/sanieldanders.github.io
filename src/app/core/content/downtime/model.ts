export type DowntimeContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | {
      type: 'table';
      caption: string;
      headers: readonly string[];
      rows: readonly (readonly string[])[];
    };

export interface DowntimeActivity {
  id: string;
  tileLabel: string;
  modalTitle: string;
  blocks: readonly DowntimeContentBlock[];
}

export interface DowntimeCategory {
  id: string;
  label: string;
  activities: readonly DowntimeActivity[];
}
