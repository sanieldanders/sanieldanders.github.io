import type { DowntimeCategory } from './model';
import { h, p, t } from './block-utils';

export const OTHER_ACTIVITIES_CATEGORY: DowntimeCategory = {
  id: 'other-activities',
  label: 'Between adventures',
  activities: [
    {
      id: 'other-recuperating',
      tileLabel: 'Recuperating',
      modalTitle: 'Recuperating',
      blocks: [
        p(
          'You can use downtime between adventures to recover from a debilitating injury, disease, or poison.\n\nAfter 1 week of downtime spent recuperating, you can make a DC 15 Constitution saving throw. On a successful save, you can choose one of the following results:\n\n• End one effect on you that prevents you from regaining hit points.\n\n• For the next week, gain advantage on saving throws against one disease or poison currently affecting you.'
        )
      ]
    },
    {
      id: 'other-researching',
      tileLabel: 'Researching',
      modalTitle: 'Researching',
      blocks: [
        p(
          'The time between adventures is a great chance to perform research, gaining insight into mysteries that have unfurled over the course of the campaign. Research can include poring over dusty tomes and crumbling scrolls in a library or buying drinks for the locals to pry rumors and gossip from their lips.\n\nWhen you begin your research, the GM determines whether the information is available, how many weeks of downtime it will take to find it, and whether there are any restrictions on your research (such as needing to seek out a specific individual, tome, or location). The GM might also require you to make one or more skill checks, such as an Intelligence (Investigation) check to find clues pointing toward the information you seek, or a Charisma (Persuasion) check to secure someone\'s aid. Once those conditions are met, you learn the information if it is available.'
        )
      ]
    },
    {
      id: 'other-shopping',
      tileLabel: 'Shopping',
      modalTitle: 'Shopping',
      blocks: [
        p(
          'You can use downtime between adventures to go on a little shopping spree looking for the best possible deals on the items you are looking to buy. For 1 week of downtime, you search high and low, potentially traveling to other villages, towns, or cities to find the items you are looking for. Items you find have a 5d4 percent price reduction in the shop they reside in due to your dedication to looking for a good deal.'
        )
      ]
    },
    {
      id: 'other-training',
      tileLabel: 'Training',
      modalTitle: 'Training',
      blocks: [
        p(
          'You can spend time between adventures learning a new language, training with a set of tools, gaining a new feat, or learning a new weapon. First, you must find an instructor willing to teach you. The GM determines how long it takes, and whether one or more ability or skill checks are required. Generally, training time is as follows for the following and each costs 100 Ryo per week. This can be adjusted by the GM as needed:'
        ),
        t('Training options', ['Training', 'Downtime cost'], [
          ['New tool or vehicle proficiency', '2 DT'],
          ['New language proficiency', '5 DT'],
          ['New armor proficiency', '8 DT'],
          ['New skill proficiency', '12 DT'],
          ['New feat', '20 DT']
        ])
      ]
    }
  ]
};
