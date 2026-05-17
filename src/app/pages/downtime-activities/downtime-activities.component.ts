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
      },
      {
        id: 'jobs-medicine-kit',
        tileLabel: 'Medicine Kit',
        modalTitle: 'Medicine kit',
        blocks: [
          { type: 'heading', text: 'Research medicine' },
          {
            type: 'paragraph',
            text:
              'When you research a new medical technique, you are able to create a new medical technique. This technique could be a helpful technique or a hostile technique used by Hunter-nin or Anbu Black Ops. Make a Strength, Dexterity or Intelligence (Medicine Kit) check vs the Medicine DC based on the Medicine Research chart below. You create this new technique and pass it on to the medical community (or Anbu/Hunter-nin community), which they use extensively. They will then pay you for these techniques based on rank.'
          },
          {
            type: 'table',
            caption: 'Research medicine',
            headers: ['Rank', 'DT Cost', 'Medicine DC', 'Payout'],
            rows: [
              ['D-Rank', '3 DT', '14', '300 Ryo'],
              ['C-Rank', '5 DT', '18', '750 Ryo'],
              ['B-Rank', '8 DT', '22', '1200 Ryo'],
              ['A-Rank', '12 DT', '26', '2000 Ryo'],
              ['S-Rank', '15 DT', '30', '3000 Ryo']
            ]
          }
        ]
      },
      {
        id: 'jobs-weaponsmith-kit',
        tileLabel: 'Weaponsmith Kit',
        modalTitle: 'Work as a weapon crafter',
        blocks: [
          { type: 'heading', text: 'Work as a weapon crafter' },
          {
            type: 'paragraph',
            text:
              'You can spend downtime working as a metalworker and weaponsmith for another person. When you do, you have an opportunity to make Ryo on the side.'
          },
          {
            type: 'paragraph',
            text:
              'First you take on a writ. A writ is a formal request for a specific item or item(s). Writs function as narrative tools for you and the DM to work out, as the type of equipment piece itself does not matter as much as the rank of the writ does. All writs are broken up into different ranks similar to missions, ranging from D-Rank up to S-Rank.\n\nThe following is the difficulty class of all writs.'
          },
          {
            type: 'table',
            caption: 'Writ rank and payout',
            headers: ['Rank', 'Writ DC', 'Duration', 'Payout'],
            rows: [
              ['D-Rank', '14', '3 DT', '300 Ryo'],
              ['C-Rank', '18', '6 DT', '750 Ryo'],
              ['B-Rank', '22', '9 DT', '1200 Ryo'],
              ['A-Rank', '26', '12 DT', '2000 Ryo'],
              ['S-Rank', '30', '15 DT', '3000 Ryo']
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'working-with-toolkits',
    label: 'Working With Toolkits',
    activities: [
      {
        id: 'toolkits-armorsmith-kit',
        tileLabel: 'Armorsmith Kit',
        modalTitle: 'Armorsmith Kit',
        blocks: [
          { type: 'heading', text: 'Craft mundane armor' },
          {
            type: 'paragraph',
            text:
              'You can craft non-enhanced armor using an Armorsmith Kit. You might also need access to special materials or locations necessary to create it. For example, someone proficient with an Armorsmith Kit needs a forge in order to craft a suit of armor.\n\nFor every downtime you spend crafting, you can craft one or more items with a total value not exceeding 100 Ryo, and you must expend ryo worth half the total value. If something you want to craft has a value greater than 100 ryo, you make progress every downtime spent in 100 ryo increments until you reach the value of the item. For example, a Reinforced Chunin Jacket (750 Ryo cost) takes 8 downtime to craft by yourself.\n\nMultiple characters can combine their efforts toward the crafting of a single item, provided that the characters all have proficiency with the requisite tools and are working together in the same place. Each character contributes 100 ryo worth of effort for every downtime helping to craft the item. For example, three characters with the requisite tool proficiency and the proper facilities can craft a Reinforced Chunin Jacket plus another item worth 150 Ryo with only spending 3 downtime each, at a total cost of 900 Ryo.\n\nWhile crafting, you automatically maintain a modest lifestyle. If you have expertise in your chosen tool, you increase the value of an item you can craft to 150 per downtime, instead of 100. If a creature with expertise helps another creature craft an item they contribute 150 Ryo worth of effort to each week of crafting.\n\nIf a crafter is in a hurry, they can attempt to craft an item even faster than what they normally would be able to. This is called Swift Crafting. By spending an additional charge of their chosen kit, they can make a Strength or Intelligence (Armorsmith or Weaponsmith Kit) check vs a Swift Craft DC found on the Kits Variant Chart. On a success, they gain a +100 Ryo Bonus for every +5 they get over the listed DC.'
          },
          { type: 'heading', text: 'Armor/weapon qualities' },
          {
            type: 'paragraph',
            text:
              'All armor and weapons listed in this book are listed at their base quality which, for the most part are made by skill craftsman, but at not the best possible quality that they could be.\n\nThese base quality arms and armaments are great for the average shinobi and should by extension be used by the vast majority, but there are better quality versions of the same equipment. While these better-quality arms are not going to provide a boost to a user’s AC or To-hit or damage when used, it does provide a much more stable base to work with when adding Enhancement seals to them.\n\nThese items for the most part are not normally sold in most shops and in most cases must be made from scratch. There are some shops that can provide better quality equipment but they are few and far between. The following are the qualities that can be applied to standard weapons and armor; Greater, Superior, Supreme and Mastercraft.'
          },
          {
            type: 'paragraph',
            text:
              'Greater. This item is made with fine materials and metals. Weapons with this quality is counted as being 5x more expensive than their base price. Armor with this quality is counted as being 50% more expensive than their base price. Items with this quality has 5 Enhancement Seal slots that can be applied to them.'
          },
          {
            type: 'paragraph',
            text:
              'Superior. This item is made with rare materials generally only found in hostile environments such as active volcanoes, mines and caves miles underwater, and in ancient Shinobi or Sage ruins. Weapons with this quality is counted as being 7x more expensive than their base price. Armor with this quality is counted as being 70% more expensive than their base price. Items with this quality has 7 Enhancement Seal slots that can be applied to them.'
          },
          {
            type: 'paragraph',
            text:
              'Supreme. This item is made with endangered materials generally only found in A and S-Rank hostile environments such as active volcano\'s miles underwater, guarded by exiled sage beasts or ancient Sage ruins protected by powerful Sage art barriers. Crafting an item of this quality requires Expertise with the required Tool Kit. Weapons with this quality is counted as being 10x more expensive than their base price. Armor with this quality is counted as being 100% more expensive than their base price. Items with this quality has 9 Enhancement Seal slots that can be applied to them.'
          },
          {
            type: 'paragraph',
            text:
              'Mastercraft. This item is made with materials generally only provided by extraplanar creatures such as Sage Beasts, Demons, Devils or even Ōtsutsuki. Very, very few Items with this quality has ever been seen or used, with even less being made by Shinobi hands. Crafting an item of this quality requires 3 creatures with Expertise with the Crafting Skill and the required Tool Kit. Weapons with this quality is counted as being 15x more expensive than their base price. Armor with this quality is counted as being 150% more expensive than their base price. Items with this quality has 11 Enhancement Seal slots that can be applied to them.'
          },
          { type: 'heading', text: 'Craft armor seals' },
          {
            type: 'paragraph',
            text:
              'You can craft Chakra Enhanced objects, including Jutsu Scrolls and Chakra-Enhanced Weapons. You must be proficient with a Weaponsmith Kit or Armorsmith Kit and be able to access a Sealsmith Forge. A Sealsmith Forge is a special location dedicated towards modifying and augmenting normally mundane weapons and tools.\n\nThe process to create a Chakra enhanced item can feel long or arduous. While unlike normal crafting where you need raw materials and a forge to melt down different materials to get the required results, this is less of an art and more focused in the realm of both alchemy and science. When you want to craft a chakra enhanced item you must first begin to decide on how you wish to upgrade this weapon by spending 1 Downtime (DT) to find the required materials for the Seal you wish to carve into your weapon or armor.'
          },
          { type: 'heading', text: 'Enhancement seal' },
          {
            type: 'paragraph',
            text:
              'An Enhancement Seal is a special form of Fuinjutsu that combine blacksmithing with Ninshou seal weaving. Enhancement Seals are what make chakra enhanced weapons so special. All base mundane weapons and armor have the potential to have up to 3 Seals imbued upon them. This seal allotment is coequally known as Seal Slots.\n\nThese Seals are organized in the standard Rank System that proliferates the Shinobi World of D-Rank all the way up to S-Rank. Each seal tier have their own list of Seal, their own Ryo Cost, and some seals even increase the difficulty to infuse them onto your item of choice.\n\nMuch like Ninjutsu, shinobi must be of appropriate level in order to utilize and in many cases, even wield Chakra Enhanced weapons. In order to wield these weapons, you must be of the appropriate level. If even one seal infused on your weapon is of a higher rank, the weapon is counted as the highest rank imbued on it.\n\nWhile most seals do not increase difficulty there is a standard Difficulty level based on the Rank of the chosen seal.\n\nUnlike normal Crafting when you are imbuing an item if you fail the Ability check, you don’t lose out on all the material or cost, you instead lose time. You waste the Downtime spent working on the item, and must commit at least half of the listed time again towards recreating the seals. With an Enhancement seal, you must be mindful of a few restrictions;\n\n• Seals of the same name, do not stack, unless otherwise stated.\n\n• For further clarification, classifications such as (Minor), (Refined) or (Mastercraft) are Not treated as a part of the seals name. So, you cannot stack the benefits of a Seal with the same name, with or without different classifications under any circumstance.\n\n• Seals of different names, do stack.\n\n• Your new armor/weapon carries the same Downtime cost as the highest ranked seal being imbued on your item.\n\n• Regardless of who makes this item, if the wielder is not of the appropriate level, they do not gain proficiency with the weapon regardless of outside features of effects. Additionally, if it is armor, they do not gain the benefit of the armor’s new effects.\n\n• You must be proficient with the imbued item in order to use it effectively.\n\nSeals of different ranks, occupy more of your weapons or armors seal slots based on the rank of the seal. So be sure to plan ahead.\n\nFinally, different seals regardless of rank carry their own Ryo cost to have them imbued. Normally the cost located in the Seals description is how much the seals materials cost in the market place for you to craft yourself. But if you wish to pay for someone else, such as a Sealsmith to imbue your weapons for you, there is a premium on this service. Increase the cost of your chosen seal(s) by 50%.'
          },
          {
            type: 'table',
            caption: 'Enhancement seal minimum level requirement',
            headers: ['Item Rank', 'Minimum Level'],
            rows: [
              ['D-Rank', 'Level 1+'],
              ['C-Rank', 'Level 5+'],
              ['B-Rank', 'Level 9+'],
              ['A-Rank', 'Level 13+'],
              ['S-Rank', 'Level 17+']
            ]
          },
          {
            type: 'table',
            caption: 'Enhancement seal crafting DC',
            headers: ['Item Rank', 'Minimum Crafting DC'],
            rows: [
              ['D-Rank', '14'],
              ['C-Rank', '18'],
              ['B-Rank', '22'],
              ['A-Rank', '26'],
              ['S-Rank', '30']
            ]
          },
          {
            type: 'table',
            caption: 'Enhancement seal slot allotment',
            headers: ['Enhancement Rank', 'Slots used'],
            rows: [
              ['D-Rank', '1'],
              ['C-Rank', '2'],
              ['B-Rank', '3'],
              ['A-Rank', '4'],
              ['S-Rank', '5']
            ]
          },
          {
            type: 'table',
            caption: 'Chakra enhanced item downtime cost',
            headers: ['Item Rank', 'Downtime Cost'],
            rows: [
              ['D-Rank', '2 Weeks'],
              ['C-Rank', '4 Weeks'],
              ['B-Rank', '8 Weeks'],
              ['A-Rank', '16 Weeks'],
              ['S-Rank', '32 Weeks']
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
