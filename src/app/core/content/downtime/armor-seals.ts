import type { DowntimeActivity } from './model';
import { h, p, sealsToBlocks, type SealEntry } from './block-utils';

const ARMOR_SEALS: SealEntry[] = [
  {
    rank: "D-Rank seals",
    name: "Blackened Seal (Minor)",
    cost: "250",
    text: "Armor imbued with this seal grants its user a +1d4 bonus to Stealth checks."
  },
  {
    rank: "D-Rank seals",
    name: "Bloody Seal (Minor)",
    cost: "300",
    text: "Armor imbued with this seal grants its wearer a 1d4 bonus to saving throws made to resist the Bleeding condition."
  },
  {
    rank: "D-Rank seals",
    name: "Bravery Seal (Minor)",
    cost: "250",
    text: "Armor imbued with this seal grants its wearer a 1d4 bonus to saving throws made to resist the Fear condition."
  },
  {
    rank: "D-Rank seals",
    name: "Chilling Seal (Minor)",
    cost: "300",
    text: "Armor imbued with this seal grants its wearer a 1d4 bonus to saving throws made to resist the Chilled condition."
  },
  {
    rank: "D-Rank seals",
    name: "Cold Steel Seal (Minor)",
    cost: "500",
    text: "Armor imbued with this seal grants its user a +1 bonus to Saving throws vs Ninjutsu."
  },
  {
    rank: "D-Rank seals",
    name: "Corrosive Seal (Minor)",
    cost: "300",
    text: "Armor imbued with this seal grants its wearer a 1d4 bonus to saving throws made to resist the Corroded condition."
  },
  {
    rank: "D-Rank seals",
    name: "Crushing Seal (Minor)",
    cost: "300",
    text: "Armor imbued with this seal grants its wearer a 1d4 bonus to saving throws made to resist the Dazed condition."
  },
  {
    rank: "D-Rank seals",
    name: "Elemental Seal (Minor)",
    cost: "250",
    text: "Armor imbued with this seal can apply half of its Damage reduction (if any) to elemental damage. When this seal is added to your armor, select one Nature Release from the following list. You cannot change this choice, once made;\n•\nEarth Release – Earth Damage\n•\nWind Release – Wind Damage\n•\nFire Release – Fire Damage\n•\nWater Release – Cold Damage\n•\nLightning Release – Lightning Damage"
  },
  {
    rank: "D-Rank seals",
    name: "Enhanced Seal (Minor)",
    cost: "300",
    craftingDc: "+1",
    text: "Armor imbued with this seal Gains +2 Damage reduction vs Bludgeoning, Piercing or Slashing damage."
  },
  {
    rank: "D-Rank seals",
    name: "Hot Seal (Minor)",
    cost: "300",
    text: "Armor imbued with this seal grants its wearer a 1d4 bonus to saving throws made to resist the Burned condition."
  },
  {
    rank: "D-Rank seals",
    name: "Martial Seal (Minor)",
    cost: "500",
    text: "Armor imbued with this seal grants its user a +1 bonus to Saving throws vs Taijutsu."
  },
  {
    rank: "D-Rank seals",
    name: "Medical Seal (Minor)",
    cost: "250",
    text: "Armor imbued with this seal can apply half of its Damage reduction (if any) to one Medical Release damage type from the following list. You cannot change this choice, once made;\n•\nAcid Damage\n•\nNecrotic Damage\n•\nPoison Damage"
  },
  {
    rank: "D-Rank seals",
    name: "Obsidian Iron Seal (Minor)",
    cost: "500",
    text: "Armor imbued with this seal grants its user a +1 bonus to Saving throws vs Bukijutsu."
  },
  {
    rank: "D-Rank seals",
    name: "Shocking Seal (Minor)",
    cost: "300",
    text: "Armor imbued with this seal grants its wearer a 1d4 bonus to saving throws made to resist the Shocked condition."
  },
  {
    rank: "D-Rank seals",
    name: "Sickening Seal (Minor)",
    cost: "300",
    text: "Armor imbued with this seal grants its wearer a 1d4 bonus to saving throws made to resist the Poisoned condition."
  },
  {
    rank: "D-Rank seals",
    name: "Sinister Seal (Minor)",
    cost: "250",
    text: "Armor imbued with this seal grants its user a +1d4 bonus to Intimidation checks."
  },
  {
    rank: "D-Rank seals",
    name: "Slick Seal (Minor)",
    cost: "250",
    text: "Armor imbued with this seal grants its user a +1d4 bonus to Athletics checks made to escape a grapple and Acrobatics checks made to squeeze through small openings."
  },
  {
    rank: "D-Rank seals",
    name: "Star Metal Seal (Minor)",
    cost: "500",
    text: "Armor imbued with this seal grants its user a +1 bonus to Saving throws vs Genjutsu."
  },
  {
    rank: "C-Rank seals",
    name: "Abyssal Seal (Refined)",
    cost: "650",
    text: "Armor imbued with this seal grants its wearer +4 damage reduction against Demons and Monstrosities weapon attacks, bukijutsu and taijutsu."
  },
  {
    rank: "C-Rank seals",
    name: "Celestial Seal (Refined)",
    cost: "650",
    text: "Armor imbued with this seal grants its wearer +4 damage reduction against Sage Beasts and Undead weapon attacks, bukijutsu and taijutsu."
  },
  {
    rank: "C-Rank seals",
    name: "Chaotic Seal (Refined)",
    cost: "650",
    text: "Armor imbued with this seal grants its wearer +4 damage reduction against Constructs and Mutants weapon attacks, bukijutsu and taijutsu.\n77"
  },
  {
    rank: "C-Rank seals",
    name: "Disruptive Seal (Refined)",
    cost: "600",
    text: "Armor imbued with this grants its user a +2 bonus to Chakra Control Checks, made to maintain concentration."
  },
  {
    rank: "C-Rank seals",
    name: "Lunar Seal (Refined)",
    cost: "750",
    craftingDc: "+1",
    text: "At Night, under the light of any phase of moon except the new moon, this armor treats critical hits with weapon attacks or Taijutsu or Bukijutsu as normal hits."
  },
  {
    rank: "C-Rank seals",
    name: "Occult Seal (Refined)",
    cost: "750",
    text: "While you are in initiative with a hostile Aberration or Undead creature, this Armor gains a +2 bonus to saving throws vs these creatures.."
  },
  {
    rank: "C-Rank seals",
    name: "Primal Seal (Refined)",
    cost: "750",
    craftingDc: "+1",
    text: "While you are in initiative with a hostile Sage Beast or Monstrosity creature, this armor gains a +2 bonus to AC."
  },
  {
    rank: "C-Rank seals",
    name: "Solar Seal (Refined)",
    cost: "750",
    craftingDc: "+1",
    text: "During the day, while under direct sunlight, the wielder of this armor gains a +1 bonus to all Ability checks."
  },
  {
    rank: "C-Rank seals",
    name: "Stellar Seal (Refined)",
    cost: "750",
    craftingDc: "+1",
    text: "During twilight, while the sun, moon, and stars are out all at once, this armor gains resistance to all damage."
  },
  {
    rank: "C-Rank seals",
    name: "Swift Seal (Refined)",
    cost: "700",
    text: "Armor imbued with this seal grants its wearer +10 to their movement speed."
  },
  {
    rank: "C-Rank seals",
    name: "Mobility Seal (Refined)",
    cost: "850",
    text: "Armor imbued with this seal grants its wearer a climbing and swimming speed equal to its wearers movement speed."
  },
  {
    rank: "C-Rank seals",
    name: "Strength Seal (Refined)",
    cost: "1000",
    text: "Armor imbued with this seal grants its wearer a +1 bonus to Strength Saving throws and Skill checks."
  },
  {
    rank: "C-Rank seals",
    name: "Dexterity Seal (Refined)",
    cost: "1000",
    text: "Armor imbued with this seal grants its wearer a +1 bonus to Dexterity Saving throws and Skill checks."
  },
  {
    rank: "C-Rank seals",
    name: "Deathless Seal (Refined)",
    cost: "1000",
    text: "Armor imbued with this seal grants its wearer a +2 bonus to Death Saving throws."
  },
  {
    rank: "C-Rank seals",
    name: "Vanishing Seal (Refined)",
    cost: "1000",
    text: "Armor imbued with this seal grants its wearer the ability to become invisible as an Action for 1 minute as if under the effect of the B-Rank Genjutsu Invisibility. Creatures can gain the benefit of this seal once per long rest."
  },
  {
    rank: "C-Rank seals",
    name: "Disguised Seal (Refined)",
    cost: "600",
    text: "Armor imbued with this seal can transform itself to look like a totally different set of clothing, as if under the effects of the Transform Genjutsu. The wearer can transform their armor into another set of clothing, once every hour."
  },
  {
    rank: "B-Rank seals",
    name: "Blackened Seal (Greater)",
    cost: "1100",
    text: "Armor imbued with this seal grants its user a +1d6 bonus to Stealth checks. This also removes any penalties to stealth an Armor may have."
  },
  {
    rank: "B-Rank seals",
    name: "Bloody Seal (Greater)",
    cost: "1250",
    text: "Armor imbued with this seal has a 1d6 bonus to saving throws made to resist the Bleeding condition."
  },
  {
    rank: "B-Rank seals",
    name: "Bravery Seal (Greater)",
    cost: "1100",
    text: "Armor imbued with seal has a 1d6 bonus to saving throws made to resist the Fear condition."
  },
  {
    rank: "B-Rank seals",
    name: "Bracing Seal (Greater)",
    cost: "1100",
    text: "Armor imbued with seal has a 1d6 bonus to saving throws made to resist being moved, pushed or pulled."
  },
  {
    rank: "B-Rank seals",
    name: "Chilling Seal (Greater)",
    cost: "1250",
    text: "Armor imbued with this seal has a 1d6 bonus to saving throws made to resist the Chilled condition."
  },
  {
    rank: "B-Rank seals",
    name: "Cold Steel Seal (Greater)",
    cost: "1500",
    text: "Armor imbued with this seal grants its user a +2 bonus to Saving throws vs Ninjutsu."
  },
  {
    rank: "B-Rank seals",
    name: "Corrosive Seal (Greater)",
    cost: "1250",
    text: "Armor imbued with this seal has a 1d6 bonus to saving throws made to resist the Corroded condition."
  },
  {
    rank: "B-Rank seals",
    name: "Crushing Seal (Greater)",
    cost: "1250",
    text: "Armor imbued with this seal has a 1d6 bonus to saving throws made to resist the Dazed condition."
  },
  {
    rank: "B-Rank seals",
    name: "Elemental Seal (Greater)",
    cost: "1300",
    text: "Armor imbued with this seal gains a +1 to AC and can apply its Damage reduction (if any) to elemental damage. When this seal is added to your armor, select one Nature Release from the following list. You cannot change this choice, once made;\n•\nEarth Release – Earth Damage\n•\nWind Release – Wind Damage\n•\nFire Release – Fire Damage\n•\nWater Release – Cold Damage\n•\nLightning Release – Lightning Damage\nIf the armor this seal is applied to has no innate Damage Reduction, then you instead apply half of its armor bonus as if it was Damage reduction to the chosen damage type.\n78"
  },
  {
    rank: "B-Rank seals",
    name: "Enhanced Seal (Greater)",
    cost: "1100",
    craftingDc: "+2",
    text: "Armor imbued with this seal Gains +4 Damage reduction vs Bludgeoning, Piercing or Slashing damage.."
  },
  {
    rank: "B-Rank seals",
    name: "Hot Seal (Greater)",
    cost: "1250",
    text: "Armor imbued with seal has a 1d6 bonus to saving throws made to resist the Burned condition."
  },
  {
    rank: "B-Rank seals",
    name: "Martial Seal (Greater)",
    cost: "1500",
    text: "Armor imbued with this seal grants its user a +2 bonus to Saving throws vs Taijutsu."
  },
  {
    rank: "B-Rank seals",
    name: "Medical Seal (Greater)",
    cost: "1300",
    text: "Armor imbued with this seal gains a +1 to AC and can apply its Damage reduction (if any) to one Medical Release damage type from the following list. You cannot change this choice, once made;\n•\nAcid Damage\n•\nNecrotic Damage\n•\nPoison Damage\nIf the armor this seal is applied to has no innate Damage Reduction, then you instead apply half of its armor bonus as if it was Damage reduction to the chosen damage type."
  },
  {
    rank: "B-Rank seals",
    name: "Shocking Seal (Greater)",
    cost: "1250",
    text: "Armor imbued with this seal has a 1d6 bonus to saving throws made to resist the Shocked condition."
  },
  {
    rank: "B-Rank seals",
    name: "Sickening Seal (Greater)",
    cost: "1250",
    text: "Armor imbued with this seal has a 1d6 bonus to saving throws made to resist the Poisoned condition."
  },
  {
    rank: "B-Rank seals",
    name: "Sinister Seal (Greater)",
    cost: "1100",
    text: "Armor imbued with this seal grants its user a +1d6 bonus to Intimidation checks."
  },
  {
    rank: "B-Rank seals",
    name: "Slick Seal (Greater)",
    cost: "1100",
    text: "Armor imbued with this seal grants its user a +1d6 bonus to Athletics checks made to escape a grapple and Acrobatics checks made to squeeze through small openings."
  },
  {
    rank: "B-Rank seals",
    name: "Star Metal Seal (Greater)",
    cost: "1500",
    text: "Armor imbued with this seal grants its user a +2 bonus to Saving throws vs Genjutsu."
  },
  {
    rank: "A-Rank seals",
    name: "Abyssal Seal (Superior)",
    cost: "1750",
    text: "Armor imbued with this seal grants its wearer +4 damage reduction against Demons and Monstrosities weapon attacks, bukijutsu, taijutsu, ninjutsu, and genjutsu."
  },
  {
    rank: "A-Rank seals",
    name: "Celestial Seal (Superior)",
    cost: "1750",
    text: "Armor imbued with this seal grants its wearer +4 damage reduction against Sage Beasts and Undead weapon attacks, bukijutsu, taijutsu, ninjutsu, and genjutsu."
  },
  {
    rank: "A-Rank seals",
    name: "Chaotic Seal (Superior)",
    cost: "1750",
    text: "Armor imbued with this seal grants its wearer +4 damage reduction against Constructs and Mutants weapon attacks, bukijutsu, taijutsu, ninjutsu, and genjutsu."
  },
  {
    rank: "A-Rank seals",
    name: "Disruptive Seal (Superior)",
    cost: "2000",
    craftingDc: "+2",
    text: "Armor imbued with this grants its user a +4 bonus to Chakra Control Checks, made to maintain concentration."
  },
  {
    rank: "A-Rank seals",
    name: "Lunar Seal (Superior)",
    cost: "1750",
    craftingDc: "+2",
    text: "At Night, under the light of any phase of moon except the new moon, this armor treats critical hits with weapon, Taijutsu, Bukijutsu, Ninjutsu and Genjutsu as normal hits."
  },
  {
    rank: "A-Rank seals",
    name: "Occult Seal (Superior)",
    cost: "1750",
    text: "While you are in initiative with a hostile Aberration or Undead creature, this Armor gains a +3 bonus to AC."
  },
  {
    rank: "A-Rank seals",
    name: "Primal Seal (Superior)",
    cost: "1750",
    text: "While you are in initiative with a hostile Sage Beast or Monstrosity creature, this armor gains a +3 bonus to AC."
  },
  {
    rank: "A-Rank seals",
    name: "Solar Seal (Superior)",
    cost: "1750",
    craftingDc: "+2",
    text: "During the day, while under direct sunlight, the wielder of this armor gains a +3 bonus to all Ability and Skill checks."
  },
  {
    rank: "A-Rank seals",
    name: "Stellar Seal (Superior)",
    cost: "1750",
    craftingDc: "+1",
    text: "During twilight, while the sun, moon, and stars are out all at once, this armor gains resistance to all damage and you reduce resisted damage by an additional -5."
  },
  {
    rank: "A-Rank seals",
    name: "Swift Seal (Superior)",
    cost: "1600",
    text: "Armor imbued with this seal grants its wearer +20 to their movement speed"
  },
  {
    rank: "A-Rank seals",
    name: "Strength Seal (Superior)",
    cost: "2000",
    text: "Armor imbued with this seal grants its wearer a +3 bonus to Strength Saving throws and Skill checks."
  },
  {
    rank: "A-Rank seals",
    name: "Dexterity Seal (Superior)",
    cost: "2000",
    text: "Armor imbued with this seal grants its wearer a +3 bonus to Dexterity Saving throws and Skill checks."
  },
  {
    rank: "A-Rank seals",
    name: "Deathless Seal (Superior)",
    cost: "2000",
    text: "Armor imbued with this seal grants its wearer advantage on Death Saving throws.\n79"
  },
  {
    rank: "A-Rank seals",
    name: "Dispelling Seal (Superior)",
    cost: "2000",
    text: "Armor imbued with this seal grants its wearer the ability to dispel harmful effects on its wearer. Once per rest, as a Reaction the wearer can cast the Dispel Chakra Ninjutsu, at B-Rank targeting yourself."
  },
  {
    rank: "S-Rank seals",
    name: "Blackened Seal (Mastercraft)",
    cost: "1100",
    text: "Armor imbued with this seal grants its user advantage on all Stealth checks. This also removes any penalties to stealth an Armor may have."
  },
  {
    rank: "S-Rank seals",
    name: "Bloody Seal (Mastercraft)",
    cost: "2400",
    text: "Armor imbued with this seal grants its user immunity to the Bleeding Condition."
  },
  {
    rank: "S-Rank seals",
    name: "Bravery Seal (Mastercraft)",
    cost: "2400",
    text: "Armor imbued with this seal grants its user immunity to the Fear Condition."
  },
  {
    rank: "S-Rank seals",
    name: "Chilling Seal (Mastercraft)",
    cost: "2400",
    text: "Armor imbued with this seal grants its user immunity to the Chilled Condition."
  },
  {
    rank: "S-Rank seals",
    name: "Crushing Seal (Mastercraft)",
    cost: "2400",
    text: "Armor imbued with this seal grants its user immunity to the Dazed Condition."
  },
  {
    rank: "S-Rank seals",
    name: "Elemental Seal (Mastercraft)",
    cost: "2250",
    text: "Armor imbued with this seal gains a +2 to AC and can apply its Damage reduction +3, to elemental damage. When this seal is added to your armor, select one Nature Release from the following list. You cannot change this choice, once made;\n•\nEarth Release – Earth Damage\n•\nWind Release – Wind Damage\n•\nFire Release – Fire Damage\n•\nWater Release – Cold Damage\n•\nLightning Release – Lightning Damage\nIf the armor this seal is applied to has no innate Damage Reduction, then you instead apply its armor bonus as if it was Damage reduction to the chosen damage type."
  },
  {
    rank: "S-Rank seals",
    name: "Enhanced Seal (Mastercraft)",
    cost: "2500",
    craftingDc: "+3",
    text: "Armor imbued with this seal Gains -6 Damage reduction vs Bludgeoning, Piercing or Slashing damage."
  },
  {
    rank: "S-Rank seals",
    name: "Hot Seal (Mastercraft)",
    cost: "2600",
    text: "Armor imbued with this seal grants its user immunity to the Burned Condition."
  },
  {
    rank: "S-Rank seals",
    name: "Martial Seal (Mastercraft)",
    cost: "2500",
    text: "Armor imbued with this seal grants its user a +3 bonus to Saving throws vs Taijutsu."
  },
  {
    rank: "S-Rank seals",
    name: "Medical Seal (Mastercraft)",
    cost: "2250",
    text: "Armor imbued with this seal gains a +2 to AC and can apply its Damage reduction +3, to one Medical Release damage type from the following list. You cannot change this choice, once made;\n•\nAcid Damage\n•\nNecrotic Damage\n•\nPoison Damage\nIf the armor this seal is applied to has no innate Damage Reduction, then you instead apply its armor bonus as if it was Damage reduction to the chosen damage type."
  },
  {
    rank: "S-Rank seals",
    name: "Obsidian Iron Seal (Mastercraft)",
    cost: "2500",
    text: "Armor imbued with this seal grants its user a +3 bonus to Saving throws vs Bukijutsu."
  },
  {
    rank: "S-Rank seals",
    name: "Shocking Seal (Mastercraft)",
    cost: "2400",
    text: "Armor imbued with this seal grants its user immunity to the Shocked Condition."
  },
  {
    rank: "S-Rank seals",
    name: "Sickening Seal (Mastercraft)",
    cost: "2400",
    text: "Armor imbued with this seal grants its user immunity to the Poisoned Condition."
  },
  {
    rank: "S-Rank seals",
    name: "Sinister Seal (Mastercraft)",
    cost: "2100",
    text: "Armor imbued with this seal grants its user advantage on all Intimidation checks."
  },
  {
    rank: "S-Rank seals",
    name: "Star Metal Seal (Mastercraft)",
    cost: "2500",
    text: "Armor imbued with this seal grants its user a +3 bonus to Saving throws vs Genjutsu."
  },
];

export const ARMOR_SEALS_ACTIVITY: DowntimeActivity = {
  id: 'crafting-armor-seals',
  tileLabel: 'Armor enhancement seals',
  modalTitle: 'Armor enhancement seals',
  blocks: [
    h('Armor enhancement seals'),
    p('Follow the rules presented previously in this chapter to craft Armor Seals.'),
    ...sealsToBlocks(ARMOR_SEALS)
  ]
};
