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
import {
  DOWNTIME_CATEGORIES,
  type DowntimeActivity
} from '../../core/content/downtime';

export type {
  DowntimeActivity,
  DowntimeCategory,
  DowntimeContentBlock
} from '../../core/content/downtime';

function findActivityById(id: string): DowntimeActivity | null {
  for (const cat of DOWNTIME_CATEGORIES) {
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

  readonly categories = DOWNTIME_CATEGORIES;
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
