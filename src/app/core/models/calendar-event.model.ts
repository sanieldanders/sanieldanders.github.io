export interface CalendarEventRow {
  id: string;
  event_on: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
}

export interface CampaignCalendarState {
  month: number;
  day: number;
  anb_year: number;
  updated_at: string | null;
}
