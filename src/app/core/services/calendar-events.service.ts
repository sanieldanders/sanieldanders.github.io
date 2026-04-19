import { Injectable, inject } from '@angular/core';
import { SupabaseAuthService } from './supabase-auth.service';
import type { CalendarEventRow, CampaignCalendarState } from '../models/calendar-event.model';

/** Gregorian year used only for storage; UI shows ANB label instead. */
export const CALENDAR_ANCHOR_YEAR = 2000;

@Injectable({ providedIn: 'root' })
export class CalendarEventsService {
  private readonly auth = inject(SupabaseAuthService);

  async getCampaignCalendarState(): Promise<CampaignCalendarState> {
    const { data, error } = await this.auth.client
      .from('campaign_calendar_state')
      .select('active_on, anb_year, updated_at')
      .eq('id', 1)
      .maybeSingle<{ active_on: string; anb_year: number; updated_at: string | null }>();
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('Campaign calendar state is not initialized.');
    }
    const { month, day } = this.parseMonthDay(data.active_on);
    return {
      month,
      day,
      anb_year: data.anb_year,
      updated_at: data.updated_at
    };
  }

  async setCampaignActiveDay(input: { month: number; day: number; anb_year: number }): Promise<void> {
    if (!this.isValidCalendarDay(input.month, input.day)) {
      throw new Error('That month and day do not form a valid calendar date.');
    }
    const active_on = this.toIsoDate(input.month, input.day);
    const user = this.auth.user();
    const { error } = await this.auth.client
      .from('campaign_calendar_state')
      .update({
        active_on,
        anb_year: input.anb_year,
        updated_at: new Date().toISOString(),
        updated_by: user?.id ?? null
      })
      .eq('id', 1);
    if (error) {
      throw new Error(error.message);
    }
  }

  /** Move the active day by a signed number of calendar days (wraps months/years correctly in 2000). */
  advanceActiveDay(month: number, day: number, deltaDays: number): { month: number; day: number } {
    const next = new Date(CALENDAR_ANCHOR_YEAR, month - 1, day + deltaDays);
    return { month: next.getMonth() + 1, day: next.getDate() };
  }

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
