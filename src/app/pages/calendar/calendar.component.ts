import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal, viewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { CalendarEventsService, CALENDAR_ANCHOR_YEAR } from '../../core/services/calendar-events.service';
import type { CalendarEventRow, CampaignCalendarState } from '../../core/models/calendar-event.model';

const UPCOMING_MAX_EVENTS = 3;
/** Inclusive day offset from the active story date (0 = today in-world). */
const UPCOMING_LAST_DAY_OFFSET = 30;

function diffCalendarDays(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86400000);
}

/** Next calendar occurrence of month/day on or after `start` (recurring annual events). */
function nextOccurrenceOnOrAfter(eventMonth: number, eventDay: number, start: Date): Date {
  const y = start.getFullYear();
  let cand = new Date(y, eventMonth - 1, eventDay);
  if (cand < start) {
    cand = new Date(y + 1, eventMonth - 1, eventDay);
  }
  return cand;
}

type UpcomingCalendarItem = {
  event: CalendarEventRow;
  nextDate: Date;
  daysUntil: number;
};

@Component({
  selector: 'app-calendar',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private readonly calendar = inject(CalendarEventsService);
  readonly admin = inject(AdminService);

  readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ] as const;
  readonly weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly events = signal<CalendarEventRow[]>([]);
  readonly activeState = signal<CampaignCalendarState | null>(null);

  readonly displayAnbYear = computed(() => this.activeState()?.anb_year ?? 60);

  readonly timeMonth = signal(1);
  readonly timeDay = signal(1);
  readonly timeAnbYear = signal(60);
  readonly timeError = signal<string | null>(null);
  readonly timeBusy = signal(false);

  readonly detailDialog = viewChild<ElementRef<HTMLDialogElement>>('detailDialog');
  readonly addDialog = viewChild<ElementRef<HTMLDialogElement>>('addDialog');

  readonly selectedDay = signal<{ month: number; day: number; items: CalendarEventRow[] } | null>(null);

  readonly addMonth = signal(1);
  readonly addDay = signal(1);
  readonly addTitle = signal('');
  readonly addDescription = signal('');
  readonly formError = signal<string | null>(null);
  readonly saveBusy = signal(false);
  readonly deleteBusyId = signal<string | null>(null);

  readonly eventsByKey = computed(() => {
    const map = new Map<string, CalendarEventRow[]>();
    for (const e of this.events()) {
      const { month, day } = this.calendar.parseMonthDay(e.event_on);
      const key = `${month}-${day}`;
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return map;
  });

  /** Next few events whose next occurrence falls within 30 days of the active story date. */
  readonly upcomingImportantDates = computed((): UpcomingCalendarItem[] => {
    const state = this.activeState();
    const all = this.events();
    if (!state || all.length === 0) {
      return [];
    }
    const start = new Date(CALENDAR_ANCHOR_YEAR, state.month - 1, state.day);
    const rows: UpcomingCalendarItem[] = [];
    for (const ev of all) {
      const { month, day } = this.calendar.parseMonthDay(ev.event_on);
      const next = nextOccurrenceOnOrAfter(month, day, start);
      const daysUntil = diffCalendarDays(start, next);
      if (daysUntil < 0 || daysUntil > UPCOMING_LAST_DAY_OFFSET) {
        continue;
      }
      rows.push({ event: ev, nextDate: next, daysUntil });
    }
    rows.sort((a, b) => {
      const t = a.nextDate.getTime() - b.nextDate.getTime();
      if (t !== 0) {
        return t;
      }
      return a.event.title.localeCompare(b.event.title);
    });
    return rows.slice(0, UPCOMING_MAX_EVENTS);
  });

  constructor() {
    void this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const [rows, state] = await Promise.all([
        this.calendar.listEvents(),
        this.calendar.getCampaignCalendarState()
      ]);
      this.events.set(rows);
      this.activeState.set(state);
      this.syncTimeFormFromState(state);
    } catch (err) {
      this.error.set((err as Error).message);
    } finally {
      this.loading.set(false);
    }
  }

  private syncTimeFormFromState(state: CampaignCalendarState): void {
    this.timeMonth.set(state.month);
    this.timeDay.set(state.day);
    this.timeAnbYear.set(state.anb_year);
  }

  isActiveDay(month: number, day: number): boolean {
    const s = this.activeState();
    return s !== null && s.month === month && s.day === day;
  }

  async submitStoryTime(): Promise<void> {
    if (!this.admin.isAdmin()) {
      return;
    }
    const month = this.timeMonth();
    const day = this.timeDay();
    const anb_year = this.timeAnbYear();
    if (!Number.isFinite(anb_year) || anb_year < 1 || anb_year > 9999) {
      this.timeError.set('ANB year must be between 1 and 9999.');
      return;
    }
    if (!this.calendar.isValidCalendarDay(month, day)) {
      this.timeError.set('Pick a valid day for that month.');
      return;
    }
    this.timeError.set(null);
    this.timeBusy.set(true);
    try {
      await this.calendar.setCampaignActiveDay({ month, day, anb_year });
      await this.reload();
    } catch (err) {
      this.timeError.set((err as Error).message);
    } finally {
      this.timeBusy.set(false);
    }
  }

  async advanceStoryTime(deltaDays: number): Promise<void> {
    if (!this.admin.isAdmin()) {
      return;
    }
    const s = this.activeState();
    if (!s) {
      return;
    }
    this.timeError.set(null);
    this.timeBusy.set(true);
    try {
      const next = this.calendar.advanceActiveDay(s.month, s.day, deltaDays);
      await this.calendar.setCampaignActiveDay({
        month: next.month,
        day: next.day,
        anb_year: s.anb_year
      });
      await this.reload();
    } catch (err) {
      this.timeError.set((err as Error).message);
    } finally {
      this.timeBusy.set(false);
    }
  }

  eventsForDay(month: number, day: number): CalendarEventRow[] {
    return this.eventsByKey().get(`${month}-${day}`) ?? [];
  }

  monthCells(month: number): (number | null)[] {
    const firstDow = new Date(CALENDAR_ANCHOR_YEAR, month - 1, 1).getDay();
    const daysInMonth = new Date(CALENDAR_ANCHOR_YEAR, month, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    return cells;
  }

  openDayDetail(month: number, day: number): void {
    const items = this.eventsForDay(month, day);
    if (items.length === 0) {
      return;
    }
    this.selectedDay.set({ month, day, items });
    queueMicrotask(() => this.detailDialog()?.nativeElement.showModal());
  }

  openEmptyDayForAdmin(month: number, day: number): void {
    if (!this.admin.isAdmin()) {
      return;
    }
    this.formError.set(null);
    this.addMonth.set(month);
    this.addDay.set(day);
    this.addTitle.set('');
    this.addDescription.set('');
    queueMicrotask(() => this.addDialog()?.nativeElement.showModal());
  }

  openAddForm(): void {
    this.formError.set(null);
    this.addMonth.set(1);
    this.addDay.set(1);
    this.addTitle.set('');
    this.addDescription.set('');
    this.addDialog()?.nativeElement.showModal();
  }

  closeDetail(): void {
    this.detailDialog()?.nativeElement.close();
    this.selectedDay.set(null);
  }

  closeAdd(): void {
    this.addDialog()?.nativeElement.close();
  }

  async submitAdd(): Promise<void> {
    const month = this.addMonth();
    const day = this.addDay();
    const title = this.addTitle().trim();
    const description = this.addDescription();
    if (!title) {
      this.formError.set('Title is required.');
      return;
    }
    if (!this.calendar.isValidCalendarDay(month, day)) {
      this.formError.set('Pick a valid day for that month.');
      return;
    }
    this.formError.set(null);
    this.saveBusy.set(true);
    try {
      const created = await this.calendar.createEvent({ month, day, title, description });
      this.events.update((rows) => {
        if (rows.some((r) => r.id === created.id)) {
          return rows;
        }
        return [...rows, created];
      });
      this.closeAdd();
      try {
        await this.reload();
      } catch {
        // Keep optimistic UI update if background refresh is unavailable.
      }
    } catch (err) {
      this.formError.set((err as Error).message);
    } finally {
      this.saveBusy.set(false);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    if (!this.admin.isAdmin()) {
      return;
    }
    this.deleteBusyId.set(id);
    try {
      await this.calendar.deleteEvent(id);
      await this.reload();
      const sel = this.selectedDay();
      if (sel) {
        const next = this.eventsForDay(sel.month, sel.day);
        if (next.length === 0) {
          this.closeDetail();
        } else {
          this.selectedDay.set({ month: sel.month, day: sel.day, items: next });
        }
      }
    } catch (err) {
      this.error.set((err as Error).message);
    } finally {
      this.deleteBusyId.set(null);
    }
  }

  upcomingRelativeLabel(daysUntil: number): string {
    if (daysUntil <= 0) {
      return 'Today';
    }
    if (daysUntil === 1) {
      return 'Tomorrow';
    }
    return `In ${daysUntil} days`;
  }

  openUpcomingItem(item: UpcomingCalendarItem): void {
    const m = item.nextDate.getMonth() + 1;
    const d = item.nextDate.getDate();
    this.openDayDetail(m, d);
  }

  onDayCellClick(month: number, day: number | null): void {
    if (day === null) {
      return;
    }
    const evs = this.eventsForDay(month, day);
    if (evs.length > 0) {
      this.openDayDetail(month, day);
    } else if (this.admin.isAdmin()) {
      this.openEmptyDayForAdmin(month, day);
    }
  }
}
