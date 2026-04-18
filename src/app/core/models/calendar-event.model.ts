export interface CalendarEventRow {
  id: string;
  event_on: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
}
