import type { DowntimeCategory } from './model';
import { h, p, t } from './block-utils';

const ARMORSMITH_KIT: DowntimeCategory['activities'][number] = {
  id: 'toolkits-armorsmith-kit',
  tileLabel: 'Armorsmith Kit',
  modalTitle: 'Armorsmith Kit',
  blocks: [
    p(
      'When spending time with an Armorsmith Kit, you can do the following with your Downtime;'
    ),
    h('Craft mundane armor'),
    p('Follow the rules presented previously in this chapter to craft Armor.'),
    h('Craft armor seals'),
    p('Follow the rules presented previously in this chapter to craft Armor Seals.'),
    h('Work as an armor crafter'),
    p(
      'You can spend downtime working as a metal and Armorsmith for another person. When you do, you have an opportunity to make Ryo on the side.\n\nFirst you take on a writ. A writ is a formal request for a specific item or item(s). Writs function as narrative tools for you and the DM to work out as the type of equipment piece itself does not matter, as much as the rank of the writ does. All writs are broken up into different ranks similar to Missions ranging from D-Rank up to S-Rank.\n\nThe following is the difficulty class of all Writs.\n\nWhen you select a Writ, roll your duration check using the listed die values. The result is the maximum total Downtime (DT) that you must spend in order to complete the Writ. You can spend a number of your DT up to the rolled result in order to complete the writ immediately, or you can choose to spend some DT now and later to complete it at a later time.\n\nAlternatively, when you accept a Writ, you can make one Strength or Intelligence (Armorsmith Kit) check vs the Writ DC. On a success, you reduce the DT required by an amount equal to the rank of the writ (D-Rank: 1, C-Rank: 2, B-Rank: 3, A-Rank: 4, S-Rank: 5.) On a failed check, you instead increase the time required by the listed amount equal to its rank. Once you begin a writ, you cannot start another one until the previous one has been completed.\n\nOnce the writ is complete you receive the listed Payout. You receive an additional +100 Ryo for each DT you reduced the original cost by.'
    ),
    t('Writ rank and payout', ['Rank', 'Writ DC', 'Duration', 'Payout'], [
      ['D-Rank', '14', '3 DT', '300 Ryo'],
      ['C-Rank', '18', '5 DT', '750 Ryo'],
      ['B-Rank', '22', '8 DT', '1200 Ryo'],
      ['A-Rank', '26', '12 DT', '2000 Ryo'],
      ['S-Rank', '30', '15 DT', '3000 Ryo']
    ])
  ]
};

const WEAPONSMITH_KIT: DowntimeCategory['activities'][number] = {
  id: 'toolkits-weaponsmith-kit',
  tileLabel: 'Weaponsmith Kit',
  modalTitle: 'Weaponsmith Kit',
  blocks: [
    p(
      'When spending time with an Weaponsmith Kit, you can do the following with your Downtime;'
    ),
    h('Craft mundane weapons'),
    p('Follow the rules presented previously in this chapter to craft Weapons.'),
    h('Craft weapon seals'),
    p('Follow the rules presented previously in this chapter to craft Weapon Seals.'),
    h('Work as a weapon crafter'),
    p(
      'You can spend downtime working as a metal and Weaponsmith for another person. When you do, you have an opportunity to make Ryo on the side.\n\nFirst you take on a writ. A writ is a formal request for a specific item or item(s). Writs function as narrative tools for you and the DM to work out as the type of equipment piece itself does not matter, as much as the rank of the writ does. All writs are broken up into different ranks similar to Missions ranging from D-Rank up to S-Rank.\n\nThe following is the difficulty class of all Writs.\n\nWhen you select a Writ, roll your duration check using the listed die values. The result is the maximum total Downtime (DT) that you must spend in order to complete the Writ. You can spend a number of your DT up to the rolled result in order to complete the writ immediately, or you can choose to spend some DT now and later to complete it at a later time.\n\nAlternatively, when you accept a Writ, you can make one Strength or Intelligence (Weaponsmith Kit) check vs the Writ DC. On a success, you reduce the DT required by an amount equal to the rank of the writ (D-Rank: 1, C-Rank: 2, B-Rank: 3, A-Rank: 4, S-Rank: 5.) On a failed check, you instead increase the time required by the listed amount equal to its rank. Once you begin a writ, you cannot start another one until the previous one has been completed.\n\nOnce the writ is complete you receive the listed Payout. You receive an additional +100 Ryo for each DT you reduced the original cost by.'
    ),
    t('Writ rank and payout', ['Rank', 'Writ DC', 'Duration', 'Payout'], [
      ['D-Rank', '14', '3 DT', '300 Ryo'],
      ['C-Rank', '18', '6 DT', '750 Ryo'],
      ['B-Rank', '22', '9 DT', '1200 Ryo'],
      ['A-Rank', '26', '12 DT', '2000 Ryo'],
      ['S-Rank', '30', '15 DT', '3000 Ryo']
    ])
  ]
};

const COOKING_KIT: DowntimeCategory['activities'][number] = {
  id: 'toolkits-cooking-kit',
  tileLabel: 'Cooking Kit',
  modalTitle: 'Cooking Kit',
  blocks: [
    p(
      'When spending time with a Cooking Kit you can do the following with your Downtime;'
    ),
    h('Research new recipes'),
    p(
      'The culinary world is one that is always expanding. You can work with your DM to figure out what new things you want to look for in the world. First, spend a number of downtime up to your remaining downtime value. Next make an Intelligence, Wisdom or Charisma (Cooking Kit) check, adding a +1 for every additional downtime spent after the first. Next compare the results to the Recipe research chart below.\n\nBased on the result of the check, you gain specified recipe of a rank equal to the highest DC beat. You do not gain all lower rank recipe\'s only the highest ranked DC you beat. When you have this Recipe, you can choose to use it to cook private meals for Ryo, or you can choose to incorporate it into a Pre-Mission dish.'
    ),
    t('Recipe research chart', ['Recipe DC', 'Rank', 'Quality Bonus', 'Bonus Payout'], [
      ['14', 'D-Rank', '+2', '+150 Ryo'],
      ['18', 'C-Rank', '+4', '+400 Ryo'],
      ['22', 'B-Rank', '+6', '+500 Ryo'],
      ['26', 'A-Rank', '+8', '+600 Ryo'],
      ['30', 'S-Rank', '+10', '+700 Ryo']
    ]),
    h('Private chef'),
    p(
      'You can spend downtime cooking for private homes, individuals or even families. But in order to do so, you must have the appropriate reputation in the culinary world to garner the correct attention. You begin with 0 Rep within the culinary world (Rep = Reputation).\n\nAs you exceed expectations you begin to gain reputation which can then be spent to gain an audience and chance to make some real Ryo in a high-class environment.\n\nYou begin as an E-Rank Chef. When cooking for customers, you must make an Intelligence, Wisdom or Charisma (Cooking Kit) check vs the Quality DC as listed on the Private Chef Chart below. On a success, you gain +1d4 Rep in the culinary world and the Payout result. On a failure, you lose 1d6 Rep in the culinary world and only gain half the payout result. Different customers have different quality DCs that must be met.\n\nYou can choose to spend one of your Research Recipe\'s on this challenge. When you do, you gain a Quality bonus and payout bonus equal to the bonus presented in the Recipe Research Chart. You only receive the payout bonus is the Quality DC was passed. Once used, you no longer can use that Recipe to impress any customer of that rank as word travels fast and other chefs pick up on this new recipe that you found copying and imitating it.'
    ),
    t('Private chef chart', ['Customer Rank', 'DT Cost', 'Rep Required', 'Quality DC', 'Payout'], [
      ['D-Rank', '3 DT', '5', '14', '150 Ryo'],
      ['C-Rank', '5 DT', '15', '18', '350 Ryo'],
      ['B-Rank', '8 DT', '25', '22', '700 Ryo'],
      ['A-Rank', '12 DT', '35', '26', '1400 Ryo'],
      ['S-Rank', '15 DT', '50', '30', '2300 Ryo']
    ]),
    h('Pre-mission dish'),
    p(
      'You can spend 1 downtime cooking for yourself and your team. When you do, make an Intelligence, Wisdom or Charisma (Cooking Kit) vs the Pre-Mission Dish DC, gaining the listed benefits. You can choose to spend additional downtime before seeing the results of the check. When you do, you gain a +2 bonus to the final result. You can select which single effect you gain from any Pre-Mission Dish rank where you beat the DC. You do not gain multiple effects unless you gain an S-Rank Dish.\n\nYou can choose to spend one of your Research Recipe\'s on this challenge. When you do, you gain a bonus to your Cooking Kit check, equal to the Quality bonus presented in the Recipe Research Chart.'
    ),
    t('Pre-mission dish', ['Dish DC', 'Dish Rank', 'Effect'], [
      [
        '14',
        'D-Rank',
        '+2 bonus to Strength, Dexterity or Constitution ability and skill checks for the next 24 hours.'
      ],
      [
        '18',
        'C-Rank',
        '+2 Bonus to Intelligence, Wisdom or Charisma skill Checks for the next 24 hours.'
      ],
      [
        '22',
        'B-Rank',
        '+2 Bonus Hit Or Chakra Die that last until your next Long Rest.'
      ],
      [
        '30',
        'A-Rank',
        '+25 Bonus to maximum HP/CP for the next 24 hours.'
      ],
      ['40', 'S-Rank', 'Select any 2 of lower rank.']
    ])
  ]
};

const DEMOLITION_KIT: DowntimeCategory['activities'][number] = {
  id: 'toolkits-demolition-kit',
  tileLabel: 'Demolition Kit',
  modalTitle: 'Demolition Kit',
  blocks: [
    p(
      'Over the course of a players downtime, they can use their Demolitions Kit to do the following;'
    ),
    h('Detonation jammer'),
    p(
      'By spending 2 Weeks of Downtime with a Demolitions Kit, you can make an Intelligence (Demolitions Kit) check vs a DC 20. On a success you create a Jamming device that blocks the triggering of all explosives within 30 feet of you. This jammer can only block 2 detonations in this way before its signal is dulled. You gain an additional detonation blocker for this device for every +3 you get over the DC.'
    ),
    h('Contract demolition'),
    p(
      'By spending a number of weeks helping construction companies, builders and other groups remove obstructions you are able to make a profit. Spend the listed downtime. When you do, you are able to find a demolition project of a Rank equal to your Level or lower. Make an Intelligence (Demolitions Kit) check vs the Demolition DC set by the Rank of the job you accept. On a success you gain the select Payout. You can choose to spend additional downtime up to your remaining amount prior to the result of the check being calculated. For every additional Downtime spent, gain a +2 bonus to the final result. For every +3 you get above the Demolition DC, you gain a bonus 200 Ryo payout.'
    ),
    t('Contract demolition', ['Character Level', 'Rank', 'DT Cost', 'Demolition DC', 'Payout'], [
      ['1+', 'D-rank', '3 DT', '14', '300 Ryo'],
      ['5+', 'C-Rank', '5 DT', '18', '750 Ryo'],
      ['9+', 'B-Rank', '8 DT', '22', '1200 Ryo'],
      ['13+', 'A-Rank', '12 DT', '26', '2000 Ryo'],
      ['17+', 'S-Rank', '15 DT', '30', '3000 Ryo']
    ])
  ]
};

const FORENSICS_KIT: DowntimeCategory['activities'][number] = {
  id: 'toolkits-forensics-kit',
  tileLabel: 'Forensics Kit',
  modalTitle: 'Forensics Kit',
  blocks: [
    p(
      'Over the course of a players downtime, they can use their Forensics Kit to do the following;'
    ),
    h('Research compounds'),
    p(
      'By spending 2 Weeks of Downtime with a Forensics Kit, select a Rank between D-Rank and S-Rank. When you do, you can make an Intelligence (Forensics Kit) check vs all Compound DCs found within that rank, on the Forensic Research Table. On a success you learn of one of the new and experimental compounds that are being experimented with across the world, or even being tested in your home village.\n\nThese compounds can be used to gain temporary bonuses on missions in the form of a volatile consumable substance. A consumable compound can be consumed as a bonus action as if it were a drink, once consumed the vial is empty and cannot be drank from a second time. In order to create multiple of the same compound you must spend additional downtime, one for each additional compound. If you wish to remake a previously created compound, the DC is reduced by -2.'
    ),
    t('Research compounds', ['Compound Name', 'Rank', 'Compound DC', 'Effects'], [
      [
        'Bulk Hebisulphuric Acid',
        'D-Rank',
        '13',
        'The Envenomed Condition instead heals you based on the damage it would deal for the next hour. 1'
      ],
      [
        'Kurudioxide',
        'D-Rank',
        '15',
        'Gain resistance to Necrotic Damage and +1d4 to the next d20 roll you make. 1'
      ],
      [
        'Uzumahexanoic',
        'C-Rank',
        '17',
        'Immediately spend up to 3 Chakra die, regaining the results + three times your constitution modifier as Chakra. 1'
      ],
      [
        'Ryunite',
        'C-Rank',
        '19',
        'Immediately spend 3 Hit die, ending one hostile conditions affecting you, regardless of the rank or number of stacks. 1'
      ],
      [
        'Yukimonoxide',
        'B-Rank',
        '23',
        'Gain immunity to One of the following conditions; Chilled, Shocked, Burned, Poisoned or Bleeding for the next hour. 2'
      ],
      [
        'Hyugoxide',
        'B-Rank',
        '27',
        'All Taijutsu and Bukijutsu you cast increases their damage die by +2 once per casting, for the next minute. 2'
      ],
      [
        'Uchihanide',
        'A-Rank',
        '27',
        'All Nature releases you cast increases their damage die by +2 once per casting, for the next minute. 2'
      ],
      ['Senjucite', 'A-Rank', '33', 'Replenish your Hit points to full. 2'],
      [
        'Otsucide',
        'S-Rank',
        '35',
        'Gain immunity to all hostile Conditions for the next minute. 3'
      ],
      ['Kuramamine', 'S-Rank', '40', 'Replenish your Chakra to full. 3']
    ]),
    h('Private investigator'),
    p(
      'By spending a number of weeks helping the military police you are able to make a profit catching criminals within the village or neighboring towns with your detective/investigative work. Spend at least 1 Week of downtime. When you do, you are able to find a police investigation in need of assistance.\n\nMake an Intelligence (Forensics Kit) check vs the Investigation DC set by the Rank of the crime your tackling. On a success you help find the perpetrator and help capture them, gaining the Payout. Starting out, you do not have the Rep (Reputation) to take on any job. So instead, you must garner a reputation by completing lower ranked investigations. Some investigations require more time to complete based on the rank. On each successful check, you can choose to spend additional downtime up to your remaining amount prior to the result of the check being calculated. For every additional Downtime spent, gain a +2 bonus to the final result.\n\nDM\'s are encouraged to potentially turn these Private investigations into side missions for Players to actively participate in.'
    ),
    t(
      'Private investigation',
      ['Rank', 'Min. Rep', 'DT Cost', 'Investigation DC', 'Rep Gained', 'Payout'],
      [
        ['D-rank', '0', '3 DT', '14', '+1d4', '300 Ryo'],
        ['C-Rank', '10', '5 DT', '18', '+1d6', '750 Ryo'],
        ['B-Rank', '15', '8 DT', '22', '+2d4', '1200 Ryo'],
        ['A-Rank', '25', '12 DT', '26', '+2d6', '2000 Ryo'],
        ['S-Rank', '40', '15 DT', '30', '+3d4', '3000 Ryo'],
        ['S+-Rank', '75', '20 DT', '35', '-', '5000 Ryo']
      ]
    )
  ]
};

const HACKERS_KIT: DowntimeCategory['activities'][number] = {
  id: 'toolkits-hackers-kit',
  tileLabel: 'Hackers Kit',
  modalTitle: 'Hackers Kit',
  blocks: [
    p(
      'Over the course of a players downtime, they can use their Hackers Kit to do the following;'
    ),
    h('Research algorithms'),
    p(
      'By spending at least 2 weeks of Downtime with a Hackers Kit, you take time to research new ways to develop or infiltrate Ninja-Net Systems. Make an Intelligence or Wisdom (Hackers Kit) check vs an Algorithm DC based on the Algorithm chart below. Based on the result you develop either new Program or Hack of a rank equal to the result. If a New Program, you are able to install it onto an allied system with permission which will help strengthen the system against hacking or provide it with a new feature or function.\n\nIf you install this program to strengthen it against hacking, increase the Security DC of this system by an amount as seen on the Algorithm chart. This new program does not count as a Trap, but a Ninja-Net System can only have a total of 2 new Programs installed into it this way. If a third program is installed, the new lowest ranked program is removed as a part of installing this new program.\n\n(If you want to install a new function, be aware that new systems should be primarily used for Role Play. This does not mean it cannot have mechanical implications or uses, but it should not be used to circumvent any challenges. If the DM would approve its use in any challenges, checks or saves, this program can be used to reduce the DC of the Check by 2, +1 for each rank above D-Rank, or it can be used to grant you a bonus to your check equal to 1d4 + 1 for each rank above D-Rank.)\n\nIf you create a new Hack, you can install this hack the next time you would gain access to a hostile entities systems or networks. You can only maintain one Hack of single rank at any time. (Ex. You can have one D-Rank hack and one C-Rank Hack, but not two C-Rank hacks.) Hacks installed into hostile systems or networks requires spending 10 minutes to install it. While a Hack is installed, it reduces their Security and Counter Hack DC by an amount equal to the result seen on the Algorithm chart'
    ),
    t('Hackers kit chart', ['Program Rank', 'Algorithm DC', 'Effects'], [
      ['D-rank', '17', '+2 Security DC or Counter hack DC'],
      ['C-Rank', '20', '+3 Security DC or Counter hack DC.'],
      ['B-Rank', '23', '+5 to Security or Counter Hack DC and +1 to the other.'],
      ['A-Rank', '28', '+5 to Security or Counter Hack DC and +3 to the other.'],
      ['S-Rank', '33', '+5 Security and Counter Hack DC.']
    ]),
    t('Hackers kit chart', ['Hack Rank', 'Algorithm DC', 'Effects'], [
      ['D-rank', '17', '-2 Security DC or Counter hack DC'],
      ['C-Rank', '20', '-3 Security DC or Counter hack DC.'],
      ['B-Rank', '23', '-5 to Security or Counter Hack DC and -1 to the other.'],
      ['A-Rank', '28', '-5 to Security or Counter Hack DC and -3 to the other.'],
      ['S-Rank', '33', '-5 Security and Counter Hack DC.']
    ])
  ]
};

const MEDICINE_KIT: DowntimeCategory['activities'][number] = {
  id: 'toolkits-medicine-kit',
  tileLabel: 'Medicine Kit',
  modalTitle: 'Medicine Kit',
  blocks: [
    p(
      'Over the course of a players downtime, they can use their Medicine Kit to do the following;'
    ),
    h('Research medicine'),
    p(
      'By spending the listed amount of Downtime with a Medicine Kit, you take time to research new medicines or medical techniques. Make an Intelligence or Wisdom (Medicine Kit) check vs the Medicine DC based on the Medicine Research chart below. Based on the result you develop either new medicines or a new medical technique of your choice. You decide which one prior to making the check. If a new Medicine, you create a medicine able to curse diseases, poisons and other afflictions of a rank equal to the result or lower. When you successfully create this medicine, you are able to recreate 2 doses for every 1 week of downtime you want to spend on manufacturing it. This dosage can be increased to 4 doses if you have regular access to a fully sufficient laboratory such as a research facility in a major land or something similar. Administering the medicine for yourself is a bonus action. Administering the medicine for another willing creature is an action. If you would try to administer this medicine to a hostile creature, you can make an Intelligence or Wisdom (Medicine Kit) check vs the targets AC.\n\n(This medicine does not need to be used to cure a mechanical affliction or effect. This can be used to help treat or cure narratively important diseases or conditions if your DM allows it to, such as lupus, cancer, or even a wholly new virus that exists within your world or narrative.).\n\nIf a new medical technique, you are able to create a new medical technique. This technique could be a helpful technique or a hostile technique used by Hunter-Nin or Anbu black-Ops. Make a Strength, Dexterity or Intelligence (Medicine Kit) check vs the Medicine DC based on the Medicine Research chart below. You create this new technique and pass it on to the medical community (or Anbu/Hunter-Nin community), which they use extensively. They will then pay you for these techniques based on rank.'
    ),
    t('Medicine research chart', ['Program Rank', 'Medicine DC', 'Effects'], [
      [
        'D-rank',
        '15',
        'Select one condition between Bleeding, Burned, Poisoned or Chilled. You automatically end the chosen condition at D-Rank.'
      ],
      [
        'C-Rank',
        '21',
        'Select one condition between Corroded, Dazed, Deafened, Paralyzed or D-Rank medicine effect on this table. You automatically end the chosen condition at C-Rank.'
      ],
      [
        'B-Rank',
        '27',
        'Select one condition between Berserk, Charmed, Fear, Slowed or a C-Rank or lower Medicine effect on this table. You automatically end the chosen condition at B-Rank.'
      ],
      [
        'A-Rank',
        '33',
        'Select one condition between Petrified, Shocked, Stunned, Weakened or a B-Rank or lower Medicine effect on this table. You automatically end the chosen condition at A-Rank.'
      ],
      [
        'S-Rank',
        '39',
        'Select one condition of your choice. You automatically end the chosen condition at S-Rank. (Excluding Exhaustion.)'
      ]
    ]),
    t('Research medicine', ['Rank', 'DT Cost', 'Medicine DC', 'Payout'], [
      ['D-rank', '3 DT', '14', '300 Ryo'],
      ['C-Rank', '5 DT', '18', '750 Ryo'],
      ['B-Rank', '8 DT', '22', '1200 Ryo'],
      ['A-Rank', '12 DT', '26', '2000 Ryo'],
      ['S-Rank', '15 DT', '30', '3000 Ryo']
    ])
  ]
};

const POISON_KIT: DowntimeCategory['activities'][number] = {
  id: 'toolkits-poison-kit',
  tileLabel: 'Poison Kit',
  modalTitle: 'Poison Kit',
  blocks: [
    p(
      'Over the course of a players downtime, they can use their Poison Kit to do the following;'
    ),
    h('Research poisons'),
    p(
      'By spending 1 week of Downtime with a Poison Kit, select a poison that you want to research, of a rank you are capable of creating, based on the Poison Research Table. When you do, you can make an Intelligence (Poison Kit or Investigation) check vs the Rank DC found within the chart. On a success you become aware of the components needed to create the poison, allowing you to craft it far easier than you would crafting it blindly. Reduce the Poison Craft DC of the chosen Poison by 5.'
    ),
    t('Poison research', ['Poison Name', 'Poison Rank', 'Poison Research DC'], [
      ['Assassins Blood', 'D-Rank', '15'],
      ['Serpent Venom', 'D-Rank', '18'],
      ['Midnight tears', 'C-Rank', '21'],
      ['Ether', 'C-Rank', '22'],
      ['Wolf\'s Bane', 'C-Rank', '23'],
      ['Devils Kiss', 'B-Rank', '24'],
      ['Kamizuru Venom', 'B-Rank', '25'],
      ['Moulding Mushroom', 'B-Rank', '26'],
      ['Angel\'s Breath', 'A-Rank', '27'],
      ['Zetsubo Petals', 'A-Rank', '29'],
      ['Torpor', 'S-Rank', '30'],
      ['Black Lilly', 'S-Rank', '31'],
      ['Malice', 'S-Rank', '32']
    ])
  ]
};

export const TOOLKITS_CATEGORY: DowntimeCategory = {
  id: 'working-with-toolkits',
  label: 'Working With Toolkits',
  activities: [
    ARMORSMITH_KIT,
    WEAPONSMITH_KIT,
    COOKING_KIT,
    DEMOLITION_KIT,
    FORENSICS_KIT,
    HACKERS_KIT,
    MEDICINE_KIT,
    POISON_KIT
  ]
};
