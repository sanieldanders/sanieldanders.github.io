import type { DowntimeActivity } from './model';
import { h, p, t } from './block-utils';

export const JUTSU_LEARNING_ACTIVITY: DowntimeActivity = {
  id: 'jutsu-learning',
  tileLabel: 'Learning & creating',
  modalTitle: 'Learning & creating a jutsu',
  blocks: [
    h('Learning / creating a jutsu'),
    p('You can spend time between adventures learning a new Jutsu that your master, your ally or your Mentor may know and you want to learn or you may want to create a new path, by creating your own jutsu. Learning or creating jutsu does not count against your Jutsu known for your class. Regardless, beware that modifying or creating a new Jutsu prevents you from upcasting that newly created jutsu.'),
    h('Learning a jutsu'),
    p('When you want to train towards Learning a New Jutsu, you must spend Downtime towards adding that jutsu to your Known jutsu list. After picking the jutsu you wish to learn, you must get the holder/owner of that particular jutsu to begin teaching you. Learning a Jutsu may be a grand experience that the DM can draw out for story purposes, but there are a few requirements that must be met.\n\n\n\n• You cannot learn Jutsu more than 1 rank Above when you are able to learn normally. (A level 4 character can spend their downtime to learn up to a C-Rank Jutsu, but not a B-Rank since a B Rank is two ranks higher than what they can at their level, which is D-Rank).\n\n\n\n• You must have the Nature Affinity to learn a Jutsu with such a requirement. (You cannot learn a Fire Release Jutsu, if you only have Wind Affinity.)\n\n\n\nYou must commit a specified amount of Downtime towards learning this jutsu. (This downtime does not need to be at the same time.)'),
    t('Learning downtime cost', ['Jutsu Rank', 'Self-Taught Downtime Cost', 'Master Taught Downtime Cost'], [
      ['E-Rank', '1', '1'],
      ['D-Rank', '3', '2'],
      ['C-Rank', '6', '4'],
      ['B-Rank', '12', '8'],
      ['A-Rank', '20', '16'],
      ['S-Rank', '40', '24']
    ]),
    h('Creating a jutsu'),
    p('When you want to train towards Creating a Jutsu you are embarking on a journey that no one else has. The Jutsu you may create may be a minor form of Medical ninjutsu, or it may be an all-powerful multi–Elemental Jutsu. Either way this is a much more difficult and involved process than learning a Jutsu. As a Jutsu creator, you must not only create the Jutsu’s Effects, but you must decide how much power it has, how much chakra it costs and the requirements needed to even perform it. Do you need the Visual prowess of the Sharingan to pull this jutsu off? Do you need the massive reserves of chakra like an Uzumaki to use it? Do you only need to have access to the Wind Affinity to use it? These are considerations you must undertake to begin the process of Jutsu Creation.\n\n\n\nWhile building your Jutsu, you must first decide on your jutsu’s rank. This decision will inform you how many effects your jutsu can hold and the final cost of your jutsu. Your jutsu will have a number of slots depending on its rank and starting restrictions, which limit when or how you can cast your chosen jutsu.'),
    h('STEP ONE: DEVELOPING THE CONCEPT OF YOUR JUTSU'),
    p('The first step of developing your own Jutsu (Or even creating a Variation of one that you already know) is to first figure out the type of jutsu it will be. Classifying your Jutsu allows you to create the core requirements of the Jutsu itself. By selecting one of the following Jutsu Types you set the path you must follow for the rest of this journey building this Jutsu.\n\n\n\na) Ninjutsu- Molding Chakra to perform a technique that interacts with a creature or the world.\n\n\n\nb) Taijutsu- Using martial Arts techniques with or without weapons to attack or defend with one\'s body.\n\n\n\nc) Genjutsu- Molding Chakra to manipulate a creature\'s 5 senses into believing one aspect of reality that they are experiencing.\n\n\n\nOnce you have the Concept of your Jutsu decided you should follow the below steps to figure out your jutsu’s effects. Each section carries its own list of Rules, Range Increments, Damage types, Keywords etc.'),
    t('Jutsu rank effect slots', ['Jutsu Rank', 'Maximum Number of Effects'], [
      ['E-Rank', '1'],
      ['D-Rank', '4'],
      ['C-Rank', '5'],
      ['B-Rank', '6'],
      ['A-Rank', '7'],
      ['S-Rank', '8']
    ])
  ]
};
