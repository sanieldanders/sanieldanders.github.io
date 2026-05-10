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
  /** Tile title (e.g. kit name). */
  tileLabel: string;
  modalTitle: string;
  blocks: readonly DowntimeContentBlock[];
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
        blocks: [
          {
            type: 'paragraph',
            text:
              'You can spend downtime working as a metalworker and armorsmith for another person. When you do, you have an opportunity to make Ryo on the side.'
          },
          {
            type: 'table',
            caption: 'Writ rank and payout',
            headers: ['Rank', 'Writ DC', 'Duration', 'Payout'],
            rows: [
              ['D-Rank', '14', '3 DT', '300 Ryo'],
              ['C-Rank', '18', '5 DT', '750 Ryo'],
              ['B-Rank', '22', '8 DT', '1200 Ryo'],
              ['A-Rank', '26', '12 DT', '2000 Ryo'],
              ['S-Rank', '30', '15 DT', '3000 Ryo']
            ]
          }
        ]
      },
      {
        id: 'jobs-cooking-kit',
        tileLabel: 'Cooking Kit',
        modalTitle: 'Cooking kit',
        blocks: [
          { type: 'heading', text: 'Research new recipes' },
          {
            type: 'paragraph',
            text:
              'The culinary world is one that is always expanding. You can work with your DM to figure out what new things you want to look for in the world. First, spend a number of downtime up to your remaining downtime value. Next make an Intelligence, Wisdom or Charisma (Cooking Kit) check, adding a +1 for every additional downtime spent after the first. Next compare the results to the Recipe research chart below.'
          },
          {
            type: 'table',
            caption: 'Recipe research chart',
            headers: ['Recipe DC', 'Rank', 'Quality Bonus', 'Bonus Payout'],
            rows: [
              ['14', 'D-Rank', '+2', '+150 Ryo'],
              ['18', 'C-Rank', '+4', '+400 Ryo'],
              ['22', 'B-Rank', '+6', '+500 Ryo'],
              ['26', 'A-Rank', '+8', '+600 Ryo'],
              ['30', 'S-Rank', '+10', '+700 Ryo']
            ]
          },
          {
            type: 'paragraph',
            text:
              'Based on the result of the check, you gain a specified recipe of a rank equal to the highest DC beat. You do not gain all lower rank recipes—only the highest ranked DC you beat. When you have this recipe, you can choose to use it to cook private meals for Ryo, or you can choose to incorporate it into a Pre-Mission dish.'
          },
          { type: 'heading', text: 'Private chef' },
          {
            type: 'paragraph',
            text:
              'You can spend downtime cooking for private homes, individuals or even families. But in order to do so, you must have the appropriate reputation in the culinary world to garner the correct attention. You begin with 0 Rep within the culinary world (Rep = Reputation).\n\nAs you exceed expectations you begin to gain reputation which can then be spent to gain an audience and chance to make some real Ryo in a high-class environment.\n\nYou begin as an E-Rank Chef. When cooking for customers, you must make an Intelligence, Wisdom or Charisma (Cooking Kit) check vs the Quality DC as listed on the Private chef chart below. On a success, you gain +1d4 Rep in the culinary world and the payout result. On a failure, you lose 1d6 Rep in the culinary world and only gain half the payout result. Different customers have different quality DCs that must be met.\n\nYou can choose to spend one of your research recipes on this challenge. When you do, you gain a Quality bonus and payout bonus equal to the bonus presented in the Recipe research chart. You only receive the payout bonus if the Quality DC was passed. Once used, you no longer can use that recipe to impress any customer of that rank as word travels fast and other chefs pick up on this new recipe that you found copying and imitating it.'
          },
          {
            type: 'table',
            caption: 'Private chef chart',
            headers: ['Customer Rank', 'DT Cost', 'Rep Required', 'Quality DC', 'Payout'],
            rows: [
              ['D-Rank', '3 DT', '5', '14', '150 Ryo'],
              ['C-Rank', '5 DT', '15', '18', '350 Ryo'],
              ['B-Rank', '8 DT', '25', '22', '700 Ryo'],
              ['A-Rank', '12 DT', '35', '26', '1400 Ryo'],
              ['S-Rank', '15 DT', '50', '30', '2300 Ryo']
            ]
          }
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
