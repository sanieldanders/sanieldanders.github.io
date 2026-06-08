import type { DowntimeActivity } from './model';
import { h, p, t, sealsToBlocks, type SealEntry } from './block-utils';

const WEAPON_SEALS: SealEntry[] = [
  {
    rank: 'D-Rank seals',
    name: 'Bane Seal (Minor)',
    cost: '350',
    text: 'When this seal is placed on a weapon, it begins to vibrate seemingly at random at the presence of the creature whom it specifically is searching for.\nSelect one creature type from the following: Beast or Plant. When this weapon deals damage to a creature of this type, that creature takes an additional 1d6 damage.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Bloody Seal (Minor)',
    cost: '200',
    text: 'When this weapon would deal damage to a creature with the Bleeding condition, the target(s) take an additional 1d4 damage.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Chilling Seal (Minor)',
    cost: '200',
    text: 'When this weapon would deal damage to a creature with the Chilled condition, the target(s) take an additional 1d4 damage.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Corrosive Seal (Minor)',
    cost: '200',
    text: 'When this weapon would deal damage to a creature with the Corroded condition, the target(s) take an additional 1d4 damage.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Crushing Seal (Minor)',
    cost: '200',
    text: 'When this weapon would deal damage to a creature with the Dazed condition, the target(s) take an additional 1d4 damage.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Elemental Seal (Minor)',
    cost: '250',
    text: 'Weapons imbued with this seal can have its damage type changed by its wielder at will. When this seal is added to your weapon, select one Nature Release from the following list. You cannot change this choice, once made;\n• Earth Release – Earth Damage\n• Wind Release – Wind Damage\n• Fire Release – Fire Damage\n• Water Release – Cold Damage\n• Lightning Release – Lightning Damage\nOnce per turn, as an object interact action, the holder can switch this weapons damage type to the chosen Nature releases damage type. The weapon still qualifies for Bukijutsu that its original damage type would allow it to be cast with.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Extending Seal (Minor)',
    cost: '250',
    text: 'Melee Weapons imbued with this seal increases their attack range by 5ft. Ranged Weapons imbued with this seal increases their attack range by 20ft.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Fanged Seal (Minor)',
    cost: '400',
    text: 'While etched with this seal, the weapon glows a faint orange color during full moons. Select one Carnivoran summon type found in the Summoning Jutsu Chapter of Jiraiya’s Jutsu Compendium.\nAs an action, the wielder can transform into a D-Rank Sage Beast without any of its Special Features or the ability to cast its Jutsu specialty once per long rest.\nWhen the wielder transforms their armor, weapons and items fuse into them for the duration. You retain your AC, ability scores, proficiencies and languages but you gain the creatures special senses (if any), the ability to communicate with it and other animals of its type (Carnivoran) and its natural weapons. You can remain in this form for 10 minutes.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Frightening Seal (Minor)',
    cost: '500',
    text: 'When this seal is placed on a weapon, it begins to release an aggressive and hostile aura.\nWhen you critically hit with this weapon, the target gains 1 rank of fear. A frightened creature makes a Wisdom saving throw at the end of each of their turns vs your Taijutsu save DC. On a success, they end the fear condition.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Grievous Seal (Minor)',
    cost: '500',
    text: 'When you use this weapon in a Taijutsu or Bukijutsu of D-Rank, affected creatures take a -1 penalty to their saving throws against the jutsu’s casting.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Hot Seal (Minor)',
    cost: '200',
    text: 'When this weapon would deal damage to a creature with the Burned condition, the target(s) take an additional 1d4 damage.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Illusory Seal (Minor)',
    cost: '250',
    text: 'Weapons imbued with this seal grant its user a +1 bonus to their Genjutsu Attack.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Martial Seal (Minor)',
    cost: '250',
    text: 'Weapons imbued with this seal grant its user a +1 bonus to their Taijutsu Attack.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Medical Seal (Minor)',
    cost: '250',
    text: 'Weapons imbued with this seal can have its damage type changed by its wielder at will. When this seal is added to your weapon, select one Medical Release damage type from the following list. You cannot change this choice, once made;\n• Acid Damage\n• Necrotic Damage\n• Poison Damage\nOnce per turn, as an object interact action, the holder can switch this weapons damage type to the chosen Nature releases damage type. The weapon still qualifies for Bukijutsu that its original damage type would allow it to be cast with.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Ninshou Seal (Minor)',
    cost: '250',
    text: 'Weapons imbued with this seal grant its user a +1 bonus to their Ninjutsu Attack.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Phantom Seal (Minor)',
    cost: '350',
    text: 'While etched with this seal, the weapon glows with a glum aura around its striking portion or its ammunition.\nThis weapon can harm creatures with no physical form such as ghosts or phantoms.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Shocking Seal (Minor)',
    cost: '200',
    text: 'When this weapon would deal damage to a creature with the Shocked condition, the target(s) take an additional 1d4 damage.'
  },
  {
    rank: 'D-Rank seals',
    name: 'Sickening Seal (Minor)',
    cost: '200',
    text: 'When this weapon would deal damage to a creature with the Poisoned condition, the target(s) take an additional 1d4 damage.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Abyssal Seal (Refined)',
    cost: '600',
    text: 'Weapons imbued with this seal deals an additional weapon damage die against Demons and Monstrosities with weapon attacks.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Celestial Seal (Refined)',
    cost: '600',
    text: 'Weapons imbued with this seal deals an additional weapon damage die against Sage Beasts and Undead with weapon attacks.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Chaotic Seal (Refined)',
    cost: '600',
    text: 'Weapons imbued with this seal deals an additional weapon damage die against Constructs and Mutants with weapon attacks.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Disruptive Seal (Refined)',
    cost: '750',
    text: 'Weapons imbued with this seal that deals damage to a creature concentrating on a Jutsu, forces the target creature to roll their Chakra Control Check to maintain concentration at a -2 Penalty to the check.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Fearsome Seal (Refined)',
    cost: '600',
    text: 'Weapons imbued with this seal grants its user proficiency with the Intimidation Skill. Additionally, the user can use their action in combat to make an Intimidation check using the infused weapons Primary ability score against a creature within 5 feet of them vs the targets Wisdom (Insight). On a success, the target drops any weapon they are holding out of fear. The target then becomes immune to this effect until they complete a long rest.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Laceration Seal (Refined)',
    cost: '600',
    text: 'Weapons imbued with this seal deals an additional weapon damage die to creatures with Temporary Hit points.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Lunar Seal (Refined)',
    cost: '1000',
    craftingDc: '+1',
    text: 'Weapons imbued with this seal deals Necrotic damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nAt Night, under the light of any phase of moon except the new moon, this weapon gains a +1 bonus to its critical threat range with weapon attacks.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Occult Seal (Refined)',
    cost: '750',
    text: 'Weapons imbued with this seal deals Cold damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nWhile you are in initiative with a hostile Aberration or Undead creature, this weapon gains a +1 bonus to attack and damage rolls with weapon attacks against those creature types.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Primal Seal (Refined)',
    cost: '750',
    craftingDc: '+1',
    text: 'Weapons imbued with this seal deals Poison damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nWhile you are in initiative with a hostile Sage Creature or Monstrosity creature, this weapon gains a +1 bonus to attack and damage rolls with weapon attacks against those creature types.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Solar Seal (Refined)',
    cost: '1000',
    craftingDc: '+1',
    text: 'Weapons imbued with this seal deals Fire damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nDuring the day, while under direct sunlight, if this weapon would fall under the effect of a Ninjutsu or Bukijutsu that increases its damage by rolling additional dice, increased the bonus damage die by +1, once per turn.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Stellar Seal (Refined)',
    cost: '1000',
    craftingDc: '+1',
    text: 'Weapons imbued with this seal deals Force damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nDuring twilight, while the sun, moon, and stars are out all at once, this weapon ignores resistance and immunity.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Storing Seal (Superior)',
    cost: '1000',
    craftingDc: '+2',
    text: 'Select one Ninjutsu, Genjutsu or Bukijutsu that the selected weapon can be used as a component to cast, in the case for Bukijutsu. The selected Jutsu cannot be higher than D-Rank.\nIf the selected Jutsu is one which doesn’t deal damage or affect other creatures, the item gains 3 Charges, which recharge at the conclusion of a long rest. You may spend 1 charge to cast the sealed jutsu. If the jutsu has a range of self, the effects take place, and additionally if the jutsu is a Concentration jutsu, you still need to concentrate on the jutsu, but you do not pay the Chakra cost.\nIf the selected Jutsu is one which deals damage or affects other creatures, the item gains 3 charges, which recharge at the conclusion of a long rest. You may spend 1 charge to cast the stored jutsu. If the stored Jutsu is a concentration jutsu, you still need to concentrate on the jutsu, but you do not pay the chakra cost. The sealed Jutsu cannot affect an Area if it deals damage or affects other creatures.'
  },
  {
    rank: 'C-Rank seals',
    name: 'Warding Seal (Refined)',
    cost: '750',
    text: 'Weapons imbued with this seal can be used to set up barriers in a 5-foot cube around its user. As an action or reaction to taking damage or failing a saving throw vs a Ninjutsu, Taijutsu, Genjutsu or Bukijutsu, the holder can activate this ward, erecting a Barrier large enough to protect only themselves or another creature. This barrier reduces the damage the target takes by an amount equal to this weapon wielders level, until the end of the current turn. Once this barrier is used, it cannot be used again until the user completes a long rest.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Bloody Seal (Greater)',
    cost: '1200',
    text: 'When this weapon would deal damage to a creature with the Bleeding condition, the target(s) take an additional 1d4 damage.\nAdditionally, if the target creature, has 1 rank of bleeding, they gain 1 more rank, up to once per turn.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Elemental Seal (Greater)',
    cost: '1300',
    text: 'Weapons imbued with this seal can have its damage type changed by its wielder at will. When this seal is added to your weapon, select one Nature Release from the following list. You cannot change this choice, once made;\n• Earth Release – Earth Damage\n• Wind Release – Wind Damage\n• Fire Release – Fire Damage\n• Water Release – Cold Damage\n• Lightning Release – Lightning Damage\nOnce per turn, as an object interact action, the holder can switch this weapons damage type to the chosen Nature releases damage type. The weapon still qualifies for Bukijutsu that its original damage type would allow it to be cast with and deals an additional 1d4 of their chosen nature releases, damage type. This does not stack with other Seals that grant dice-based bonuses to damage rolls.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Chilling Seal (Greater)',
    cost: '1500',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Chilled condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d4 bonus to the first saving throw you make vs a Jutsu with the Fire Release keyword, until the beginning of your next turn.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Corrosive Seal (Greater)',
    cost: '1500',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Corroded condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d4 bonus to the first saving throw you make vs a Jutsu that would inflict an Elemental condition, until the beginning of your next turn.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Crushing Seal (Greater)',
    cost: '1500',
    text: 'Once per turn, weapons imbued with this seal that deal damage to a creature with the Dazed condition, are able to disorient a creature further. The Dazed creature must make a Strength saving throw vs your Taijutsu save DC. On a failed save they lose the Dazed condition, but become Staggered until the end of their next turn.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Extending Seal (Greater)',
    cost: '1250',
    text: 'Melee Weapons imbued with this seal increases their attack range by 10ft. Ranged Weapons imbued with this seal increases their attack range by 30ft.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Fanged Seal (Greater)',
    cost: '1400',
    text: 'While etched with this seal, the weapon glows a faint orange color during full moons. Select one Carnivoran summon type found in the Summoning Jutsu Chapter of Jiraiya’s Jutsu Compendium.\nAs an action, once per long rest, the wielder can transform into a C-Rank Sage Beast gaining only its D-Rank Special Features, but not the ability to cast its Jutsu specialty.\nWhen the wielder transforms their armor, weapons and items fuse into them for the duration. You retain your AC, ability scores, proficiencies and languages but you gain the creatures special senses (if any), the ability to communicate with it and other animals of its type (Carnivoran) and its natural weapons. You can remain in this form for 1 hour.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Frightening Seal (Greater)',
    cost: '1500',
    text: 'When this seal is placed on a weapon, it begins to release an aggressive and hostile aura.\nWhen you critically hit with this weapon, the target gains 1 rank of fear and 1 rank of Concussed. A frightened and Concussed creature makes a Wisdom saving throw at the end of each of their turns vs your Taijutsu save DC. On a success, they end the fear condition.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Grievous Seal (Greater)',
    cost: '1500',
    text: 'When you use this weapon in a Taijutsu or Bukijutsu of C-Rank or lower, affected creatures take a -2 penalty to their saving throws against the jutsu’s casting.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Hot Seal (Greater)',
    cost: '1500',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Burned condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d4 bonus to the first saving throw you make vs a Jutsu with the Wind Release keyword, until the beginning of your next turn.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Illusory Seal (Greater)',
    cost: '1250',
    text: 'Weapons imbued with this seal grant its user a +2 bonus to their Genjutsu Attack.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Martial Seal (Greater)',
    cost: '1250',
    text: 'Weapons imbued with this seal grant its user a +2 bonus to their Taijutsu Attack.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Medical Seal (Greater)',
    cost: '1300',
    text: 'Weapons imbued with this seal can have its damage type changed by its wielder at will. When this seal is added to your weapon, select one Medical Release damage type from the following list. You cannot change this choice, once made;\n• Acid Damage\n• Necrotic Damage\n• Poison Damage\nOnce per turn, as an object interact action, the holder can switch this weapons damage type to the chosen Nature releases damage type. The weapon still qualifies for Bukijutsu that its original damage type would allow it to be cast with and deals an additional bonus 1d4 of their chosen damage type. This does not stack with other Seals that grant dice-based bonuses to damage rolls.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Ninshou Seal (Greater)',
    cost: '1250',
    text: 'Weapons imbued with this seal grant its user a +2 bonus to their Ninjutsu Attack.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Shocking Seal (Greater)',
    cost: '1500',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Shocked condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d4 bonus to the first saving throw you make vs a Jutsu with the Earth Release keyword, until the beginning of your next turn.'
  },
  {
    rank: 'B-Rank seals',
    name: 'Sickening Seal (Greater)',
    cost: '1500',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Envenomed condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d4 bonus to the first saving throw you make vs a Jutsu that would inflict a Physical condition, until the beginning of your next turn.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Abyssal Seal (Superior)',
    cost: '1750',
    text: 'Weapons imbued with this seal deals an additional 2 weapon damage die against Demons and Monstrosities with weapon attacks.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Celestial Seal (Superior)',
    cost: '1750',
    text: 'Weapons imbued with this seal deals an additional 2 weapon damage die against Sage Beasts and Undead with weapon attacks.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Chaotic Seal (Superior)',
    cost: '1750',
    text: 'Weapons imbued with this seal deals an additional 2 weapon damage die against Constructs and Mutants with weapon attacks.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Disruptive Seal (Superior)',
    cost: '1800',
    craftingDc: '+2',
    text: 'Weapons imbued with this seal that deals damage to a creature concentrating on a Jutsu, forces the target creature to roll their Chakra Control Check to maintain concentration at a -5 Penalty to the check.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Laceration Seal (Superior)',
    cost: '2000',
    text: 'Weapons imbued with this seal deals an additional 2 weapon damage die to creatures with Temporary Hit points with weapon attacks. Additionally, if you reduce a creature’s temporary hit points to 0 using this weapon, the next time they would gain temporary hit points, they instead gain only half.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Lunar Seal (Superior)',
    cost: '1750',
    craftingDc: '+1',
    text: 'Weapons imbued with this seal deals Necrotic damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nAt Night, under the light of any phase of moon except the new moon, this weapon gains a +2 bonus to its critical threat range with weapon attacks.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Occult Seal (Superior)',
    cost: '2000',
    text: 'Weapons imbued with this seal deals Cold damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nWhile you are in initiative with a hostile Aberration or Undead creature, this weapon gains a +3 bonus to attack and damage rolls with weapon attacks against those creature types.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Primal Seal (Superior)',
    cost: '1750',
    text: 'Weapons imbued with this seal deals Poison damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nWhile you are in initiative with a hostile Sage Creature or Monstrosity creature, this weapon gains a +3 bonus to attack and damage rolls with weapon attacks against those creature types.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Solar Seal (Superior)',
    cost: '1750',
    craftingDc: '+1',
    text: 'Weapons imbued with this seal deals Fire damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nDuring the day, while under direct sunlight, if this weapon would fall under the effect of a Ninjutsu or Bukijutsu that increases its damage by rolling additional dice, increased the bonus damage die by +2, once per turn.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Speed Seal (Superior)',
    cost: '2000',
    craftingDc: '+3',
    text: 'Weapons imbued with this seal can be used in extremely quick succession. If this weapon was used to make an attack with the attack action, or with a bonus action, you make one additional weapon attack with this weapon. This happens once per turn.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Stellar Seal (Superior)',
    cost: '1750',
    craftingDc: '+1',
    text: 'Weapons imbued with this seal deals Force damage in addition to their listed damage for the purposed of overcoming resistance and capitalizing on Vulnerabilities.\nDuring twilight, while the sun, moon, and stars are out all at once, this weapon ignores resistance and immunity and ignores damage reduction from all sources.'
  },
  {
    rank: 'A-Rank seals',
    name: 'Storing Seal (Superior)',
    cost: '2000',
    craftingDc: '+2',
    text: 'Select one Ninjutsu, Genjutsu or Bukijutsu that the selected weapon can be used as a component to cast, in the case for Bukijutsu. The selected Jutsu cannot be higher than B-Rank.\nIf the selected Jutsu is one which doesn’t deal damage or affect other creatures, the item gains 3 Charges, which recharge at the conclusion of a long rest. You may spend 1 charge to cast the sealed jutsu. If the jutsu has a range of self, the effects take place, and additionally if the jutsu is a Concentration jutsu, you still need to concentrate on the jutsu, but you do not pay the Chakra cost.\nIf the selected Jutsu is one which deals damage or affects other creatures, the item gains 3 charges, which recharge at the conclusion of a long rest. You may spend 1 charge to cast the stored jutsu. If the stored Jutsu is a concentration jutsu, you still need to concentrate on the jutsu, but you do not pay the chakra cost. The sealed Jutsu cannot affect an Area if it deals damage or affects other creatures.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Bloody Seal (Mastercraft)',
    cost: '2250',
    text: 'When this weapon would deal damage to a creature with the Bleeding condition, the target(s) take an additional 2d4 damage.\nAdditionally, if the target creature, has 1 rank of bleeding, they gain 1 rank of Laceration, once per turn.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Elemental Seal (Mastercraft)',
    cost: '2200',
    text: 'Weapons imbued with this seal can have its damage type changed by its wielder at will. When this seal is added to your weapon, select one Nature Release from the following list. You cannot change this choice, once made;\n• Earth Release – Earth Damage\n• Wind Release – Wind Damage\n• Fire Release – Fire Damage\n• Water Release – Cold Damage\n• Lightning Release – Lightning Damage\nOnce per turn, as an object interact action, the holder can switch this weapons damage type to the chosen Nature releases damage type. The weapon still qualifies for Bukijutsu that its original damage type would allow it to be cast with and increases its damage by +1 weapon damage die that deal the damage type of their chosen nature releases. This does not stack with other Seals that grant dice-based bonuses to damage rolls.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Medical Seal (Mastercraft)',
    cost: '2200',
    text: 'Weapons imbued with this seal can have its damage type changed by its wielder at will. When this seal is added to your weapon, select one Medical Release damage type from the following list. You cannot change this choice, once made;\n• Acid Damage\n• Necrotic Damage\n• Poison Damage\nOnce per turn, as an object interact action, the holder can switch this weapons damage type to the chosen Nature releases damage type. The weapon still qualifies for Bukijutsu that its original damage type would allow it to be cast with and increases its damage by +1 weapon damage die that deal their chosen damage type. This does not stack with other Seals that grant dice-based bonuses to damage rolls.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Chilling Seal (Mastercraft)',
    cost: '2250',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Chilled condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d6 bonus to the first saving throw you make vs a Jutsu with the Fire Release keyword, until the beginning of your next turn.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Corrosive Seal (Mastercraft)',
    cost: '2250',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Corroded condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d6 bonus to the first saving throw you make vs a Jutsu that would inflict an Elemental condition, until the beginning of your next turn.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Crushing Seal (Mastercraft)',
    cost: '2250',
    text: 'Once per turn, weapons imbued with this seal that deal damage to a creature with the Dazed condition, are able to disorient a creature further. The Dazed creature becomes Staggered.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Grievous Seal (Mastercraft)',
    cost: '2500',
    text: 'When you use this weapon in a Taijutsu or Bukijutsu of A-Rank or lower, affected creatures take a -3 penalty to their saving throws against the jutsu’s casting.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Hot Seal (Mastercraft)',
    cost: '2250',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Burned condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d6 bonus to the first saving throw you make vs a Jutsu with the Wind Release keyword, until the beginning of your next turn.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Illusory Seal (Mastercraft)',
    cost: '2500',
    text: 'Weapons imbued with this seal grant its user a +3 bonus to their Genjutsu Attack.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Martial Seal (Mastercraft)',
    cost: '2500',
    text: 'Weapons imbued with this seal grant its user a +3 bonus to their Taijutsu Attack.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Ninshou Seal (Mastercraft)',
    cost: '2500',
    text: 'Weapons imbued with this seal grant its user a +3 bonus to their Ninjutsu Attack.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Shocking Seal (Mastercraft)',
    cost: '2250',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Shocked condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d6 bonus to the first saving throw you make vs a Jutsu with the Earth Release keyword, until the beginning of your next turn.'
  },
  {
    rank: 'S-Rank seals',
    name: 'Sickening Seal (Mastercraft)',
    cost: '2250',
    text: 'Weapons imbued with this seal that deal damage to a creature with the Envenomed condition, are able to siphon some of that energy away from the target once per turn, granting you a 1d6 bonus to the first saving throw you make vs a Jutsu that would inflict a Physical condition, until the beginning of your next turn.'
  },
];

const STORING_SEAL_JUTSU_DC_TABLE = t(
  'Storing seal jutsu DC',
  ['Jutsu Rank', 'Save DC'],
  [
    ['D-Rank', '15'],
    ['C-Rank', '17'],
    ['B-Rank', '19']
  ]
);

export const WEAPON_SEALS_ACTIVITY: DowntimeActivity = {
  id: 'crafting-weapon-seals',
  tileLabel: 'Weapon enhancement seals',
  modalTitle: 'Weapon enhancement seals',
  blocks: [
    h('Weapon enhancement seals'),
    p('The following seals can be imbued on weapons at a Sealsmith Forge. See the Enhancement seal rules for minimum level requirements, crafting DCs, slot allotment, downtime costs, and imbuing restrictions.'),
    ...sealsToBlocks(WEAPON_SEALS.slice(0, 30)),
    STORING_SEAL_JUTSU_DC_TABLE,
    ...sealsToBlocks(WEAPON_SEALS.slice(30, 39)),
    STORING_SEAL_JUTSU_DC_TABLE,
    ...sealsToBlocks(WEAPON_SEALS.slice(39, 64)),
    STORING_SEAL_JUTSU_DC_TABLE,
    ...sealsToBlocks(WEAPON_SEALS.slice(64)),
  ]
};
