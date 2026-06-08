import type { DowntimeCategory } from './model';
import { h, p, t } from './block-utils';

export const GENERAL_CATEGORY: DowntimeCategory = {
  id: 'general',
  label: 'Overview',
  activities: [
    {
      id: 'general-lifestyle',
      tileLabel: 'Lifestyle expenses',
      modalTitle: 'Lifestyle expenses',
      blocks: [
        p(
          'Between adventures, you choose a particular quality of life and pay the cost of maintaining that lifestyle, as described in chapter 5. Living a particular lifestyle doesn’t have a huge effect on your character, but your lifestyle can affect the way other individuals and groups react to you. For example, when you lead a wealthy lifestyle, it might be easier for you to influence the nobles of the city than if you live in poverty.'
        ),
        t('Lifestyle costs', ['Lifestyle', 'Ryo cost / week'], [
          ['Wretched', '—'],
          ['Squalid', '5'],
          ['Poor', '10'],
          ['Modest', '50'],
          ['Comfortable', '75'],
          ['Wealthy', '100'],
          ['Unprecedented', '250']
        ])
      ]
    },
    {
      id: 'general-downtime-rules',
      tileLabel: 'Downtime rules',
      modalTitle: 'Downtime activities',
      blocks: [
        p(
          'Between adventures, the GM might ask you what your character is doing during downtime. Periods of downtime are always in the form of weeks (1 week, 2 weeks, or even 12 weeks), but each downtime activity requires a certain number of weeks to complete before you gain any benefit, and at least 8–10 hours of each day within the week must be spent on the downtime activity for the week to count. The weeks do not need to be consecutive. If you have more than the minimum number of weeks to spend, you can keep doing the same thing for a longer period of time, or switch to a new downtime activity.\n\nDowntime activities other than the ones presented here are possible. If you want your character to spend downtime performing an activity not covered here, discuss it with your GM.'
        )
      ]
    },
    {
      id: 'general-carousing',
      tileLabel: 'Carousing',
      modalTitle: 'Carousing',
      blocks: [
        p(
          'You choose whether to spend time with the lower, middle, or upper class, costing 10, 50, and 250 Ryo per week respectively. If you want to spend time with the upper class, you’ll either need access to the local nobility or be disguised as one. During the week you mingle, party, and socialize with members of that social class. At the end of the week, you gain a number of contacts within that class. Some examples are criminals in the lower class, soldiers in the middle class, and nobles in the upper class. This option is great for collecting allies and intel, especially if you are new to the area. If your character is a charismatic one who needs information, then you should carouse as much as you can.'
        ),
        t('Carousing cost by class', ['Social class', 'Ryo cost / week'], [
          ['Lower', '10'],
          ['Middle', '50'],
          ['Upper', '250']
        ])
      ]
    }
  ]
};
