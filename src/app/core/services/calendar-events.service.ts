import { Injectable, inject } from '@angular/core';
import { SupabaseAuthService } from './supabase-auth.service';
import type { CalendarEventRow } from '../models/calendar-event.model';

/** Gregorian year used only for storage; UI shows ANB label instead. */
export const CALENDAR_ANCHOR_YEAR = 2000;

@Injectable({ providedIn: 'root' })
export class CalendarEventsService {
  private readonly auth = inject(SupabaseAuthService);

  async listEvents(): Promise<CalendarEventRow[]> {
    const { data, error } = await this.auth.client
      .from('calendar_events')
      .select('id, event_on, title, description, created_at, created_by')
      .order('event_on', { ascending: true })
      .order('title', { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as CalendarEventRow[];
  }

  async createEvent(input: { month: number; day: number; title: string; description: string }): Promise<void> {
    const eventOn = this.toIsoDate(input.month, input.day);
    const user = this.auth.user();
    const { error } = await this.auth.client.from('calendar_events').insert({
      event_on: eventOn,
      title: input.title.trim(),
      description: input.description.trim() ? input.description.trim() : null,
      created_by: user?.id ?? null
    });
    if (error) {
      throw new Error(error.message);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await this.auth.client.from('calendar_events').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }

  toIsoDate(month: number, day: number): string {
    const m = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${CALENDAR_ANCHOR_YEAR}-${m}-${d}`;
  }

  parseMonthDay(eventOn: string): { month: number; day: number } {
    const [, mm, dd] = eventOn.split('-');
    return { month: Number(mm), day: Number(dd) };
  }

  isValidCalendarDay(month: number, day: number): boolean {
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
    const dt = new Date(CALENDAR_ANCHOR_YEAR, month - 1, day);
    return dt.getFullYear() === CALENDAR_ANCHOR_YEAR && dt.getMonth() === month - 1 && dt.getDate() === day;
  }
}
