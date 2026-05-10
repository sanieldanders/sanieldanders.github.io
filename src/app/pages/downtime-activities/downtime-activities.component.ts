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
  /** Tile title (e.g. kit name). */
  tileLabel: string;
  modalTitle: string;
  intro: string;
  tableCaption: string;
  writRows: readonly DowntimeWritRow[];
}

export interface DowntimeCategory {
  id: string;
  /** Collapsible section label (e.g. Jobs). */
  label: string;
  activities: readonly DowntimeActivity[];
}

const CATEGORIES: readonly DowntimeCategory[] = [
  {
    id: 'jobs',
    label: 'Jobs',
    activities: [
      {
        id: 'jobs-armor-crafter',
        tileLabel: 'Armorsmith Kit',
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
    ]
  }
];

function findActivityById(id: string): DowntimeActivity | null {
  for (const cat of CATEGORIES) {
    const found = cat.activities.find((a) => a.id === id);
    if (found) {
      return found;
    }
  }
  return null;
}

@Component({
  selector: 'app-downtime-activities',
  imports: [RouterLink],
  templateUrl: './downtime-activities.component.html',
  styleUrl: './downtime-activities.component.scss'
})
export class DowntimeActivitiesComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = CATEGORIES;
  readonly selectedId = signal<string | null>(null);

  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  readonly selectedActivity = computed(() => {
    const id = this.selectedId();
    if (!id) {
      return null;
    }
    return findActivityById(id);
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
