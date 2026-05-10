import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DowntimeWritRow {
  rank: string;
  writDc: string;
  duration: string;
  payout: string;
}

export interface DowntimeActivity {
  id: string;
  tileLabel: string;
  modalTitle: string;
  intro: string;
  tableCaption: string;
  writRows: readonly DowntimeWritRow[];
}

const ACTIVITIES: readonly DowntimeActivity[] = [
  {
    id: 'jobs-armor-crafter',
    tileLabel: 'Jobs',
    modalTitle: 'Work as an armor crafter',
    intro:
      'You can spend downtime working as a metalworker and armorsmith for another person. When you do, you have an opportunity to make Ryo on the side.',
    tableCaption: 'Writ rank and payout',
    writRows: [
      { rank: 'D-Rank', writDc: '14', duration: '3 DT', payout: '300 Ryo' },
      { rank: 'C-Rank', writDc: '18', duration: '5 DT', payout: '750 Ryo' },
      { rank: 'B-Rank', writDc: '22', duration: '8 DT', payout: '1200 Ryo' },
      { rank: 'A-Rank', writDc: '26', duration: '12 DT', payout: '2000 Ryo' },
      { rank: 'S-Rank', writDc: '30', duration: '15 DT', payout: '3000 Ryo' }
    ]
  }
];

@Component({
  selector: 'app-downtime-activities',
  imports: [RouterLink],
  templateUrl: './downtime-activities.component.html',
  styleUrl: './downtime-activities.component.scss'
})
export class DowntimeActivitiesComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly activities = ACTIVITIES;
  readonly selectedId = signal<string | null>(null);

  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  readonly selectedActivity = computed(() => {
    const id = this.selectedId();
    if (!id) {
      return null;
    }
    return ACTIVITIES.find((a) => a.id === id) ?? null;
  });

  constructor() {
    effect(() => {
      this.doc.body.style.overflow = this.selectedActivity() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }

  openActivity(activity: DowntimeActivity): void {
    this.selectedId.set(activity.id);
    setTimeout(() => this.closeBtn()?.nativeElement?.focus(), 0);
  }

  closeModal(): void {
    this.selectedId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selectedActivity()) {
      this.closeModal();
    }
  }
}
