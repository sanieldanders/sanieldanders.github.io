import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal, viewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { CalendarEventsService, CALENDAR_ANCHOR_YEAR } from '../../core/services/calendar-events.service';
import type { CalendarEventRow } from '../../core/models/calendar-event.model';

@Component({
  selector: 'app-calendar',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private readonly calendar = inject(CalendarEventsService);
  readonly admin = inject(AdminService);

  readonly anbYear = 60;
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

  constructor() {
    void this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.calendar.listEvents();
      this.events.set(rows);
    } catch (err) {
      this.error.set((err as Error).message);
    } finally {
      this.loading.set(false);
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
      await this.calendar.createEvent({ month, day, title, description });
      await this.reload();
      this.closeAdd();
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
