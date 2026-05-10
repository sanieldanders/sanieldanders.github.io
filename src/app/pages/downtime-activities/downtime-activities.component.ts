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
      },
      {
        id: 'jobs-demolition-kit',
        tileLabel: 'Demolition Kit',
        modalTitle: 'Demolition kit',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Contract Demolition. By spending a number of weeks helping construction companies, builders and other groups remove obstructions you are able to make a profit. Spend the listed downtime. When you do, you are able to find a demolition project of a Rank equal to your Level or lower. Make an Intelligence (Demolition Kit) check vs the Demolition DC set by the Rank of the job you accept. On a success you gain the listed payout. You can choose to spend additional downtime up to your remaining amount prior to the result of the check being calculated. For every additional Downtime spent, gain a +2 bonus to the final result. For every +3 you get above the Demolition DC, you gain a bonus 200 Ryo payout.'
          },
          {
            type: 'table',
            caption: 'Contract demolition',
            headers: ['Character Level', 'Rank', 'DT Cost', 'Demolition DC', 'Payout'],
            rows: [
              ['1+', 'D-Rank', '3 DT', '14', '300 Ryo'],
              ['5+', 'C-Rank', '5 DT', '18', '750 Ryo'],
              ['9+', 'B-Rank', '8 DT', '22', '1200 Ryo'],
              ['13+', 'A-Rank', '12 DT', '26', '2000 Ryo'],
              ['17+', 'S-Rank', '15 DT', '30', '3000 Ryo']
            ]
          }
        ]
      },
      {
        id: 'jobs-forensics-kit',
        tileLabel: 'Forensics Kit',
        modalTitle: 'Forensics kit',
        blocks: [
          { type: 'heading', text: 'Consumable compounds' },
          {
            type: 'paragraph',
            text:
              'These compounds can be used to gain temporary bonuses on missions in the form of a volatile consumable substance. A consumable compound can be consumed as a bonus action as if it were a drink; once consumed, the vial is empty and cannot be drunk from a second time. In order to create multiple of the same compound you must spend additional downtime—one for each additional compound. If you wish to remake a previously created compound, the DC is reduced by 2.'
          },
          { type: 'heading', text: 'Private Investigator' },
          {
            type: 'paragraph',
            text:
              'By spending a number of weeks helping the military police you are able to make a profit catching criminals within the village or neighboring towns with your detective and investigative work. Spend at least 1 week of downtime. When you do, you are able to find a police investigation in need of assistance.\n\nMake an Intelligence (Forensics Kit) check vs the Investigation DC set by the rank of the crime you are tackling. On a success you help find the perpetrator and help capture them, gaining the payout. Starting out, you do not have the Rep (Reputation) to take on any job. So instead, you must garner a reputation by completing lower ranked investigations. Some investigations require more time to complete based on the rank. On each successful check, you can choose to spend additional downtime up to your remaining amount prior to the result of the check being calculated. For every additional downtime spent, gain a +2 bonus to the final result.\n\nDMs are encouraged to potentially turn these private investigations into side missions for players to actively participate in.'
          },
          {
            type: 'table',
            caption: 'Private investigation',
            headers: ['Rank', 'Min. Rep', 'DT Cost', 'Investigation DC', 'Rep gained', 'Payout'],
            rows: [
              ['D-Rank', '0', '3 DT', '14', '+1d4', '300 Ryo'],
              ['C-Rank', '10', '5 DT', '18', '+1d6', '750 Ryo'],
              ['B-Rank', '15', '8 DT', '22', '+2d4', '1200 Ryo'],
              ['A-Rank', '25', '12 DT', '26', '+2d6', '2000 Ryo'],
              ['S-Rank', '40', '15 DT', '30', '+3d4', '3000 Ryo'],
              ['S+-Rank', '75', '20 DT', '35', '-', '5000 Ryo']
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
