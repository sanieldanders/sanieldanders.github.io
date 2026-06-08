import type { DowntimeCategory } from './model';
import { h, p, t } from './block-utils';
import { WEAPON_SEALS_ACTIVITY } from './weapon-seals';
import { ARMOR_SEALS_ACTIVITY } from './armor-seals';

const CRAFTING_NON_ENHANCED: DowntimeCategory['activities'][number] = {
  id: 'crafting-non-enhanced',
  tileLabel: 'Crafting mundane items',
  modalTitle: 'Crafting non-enhanced items',
  blocks: [
    p(
      'You can craft unenhanced objects, including adventuring equipment and works of art. You must be proficient with tools related to the object you are trying to create (typically Armorsmith or Weaponsmith Toolkit). You might also need access to special materials or locations necessary to create it. For example, someone proficient with an Armorsmith Kit needs a forge in order to craft a sword or suit of armor.\n\nFor every downtime you spend crafting, you can craft one or more items with a total value not exceeding 100 Ryo, and you must expend ryo worth half the total value. If something you want to craft has a value greater than 100 ryo, you make progress every downtime spent in 100 ryo increments until you reach the value of the item. For example, a Reinforced Chunin Jacket (750 Ryo cost) takes 8 downtime to craft by yourself.\n\nMultiple characters can combine their efforts toward the crafting of a single item, provided that the characters all have proficiency with the requisite tools and are working together in the same place. Each character contributes 100 ryo worth of effort for every downtime helping to craft the item. For example, three characters with the requisite tool proficiency and the proper facilities can craft a Reinforced Chunin Jacket plus another item worth 150 Ryo in with only spending 3 downtime each, at a total cost of 900 Ryo.\n\nWhile crafting, you automatically maintain a modest lifestyle. If you have expertise in your chosen tool, you increase the value of an item you can craft to 150 per downtime, instead of 100. If a crafter with expertise helps another creature craft an item they contribute 150 Ryo worth of effort to each week of crafting.\n\nIf a crafter is in a hurry, they can attempt to craft an item even faster than what they normally would be able to. This is called Swift Crafting. By spending an additional charge of their chosen kit, they can make a Strength or Intelligence (Armorsmith or Weaponsmith Kit) check vs a Swift Craft DC found on the Kits Variant Chart. On a success, they gain a +100 Ryo Bonus for every +5 they get over the listed DC.'
    )
  ]
};

const ARMOR_WEAPON_QUALITIES: DowntimeCategory['activities'][number] = {
  id: 'crafting-qualities',
  tileLabel: 'Armor & weapon qualities',
  modalTitle: 'Armor/weapon qualities',
  blocks: [
    p(
      'All armor and weapons listed in this book are listed at their base quality which, for the most part are made by skilled craftsman, but at not the best possible quality that they could be.\n\nThese base quality arms and armaments are great for the average shinobi and should by extension be used by the vast majority, but there are better quality versions of the same equipment. While these better-quality arms are not going to provide a boost to a user’s AC or To-hit or damage when used, it does provide a much more stable base to work with when adding Enhancement seals to them.\n\nThese items for the most part are not normally sold in most shops and in most cases must be made from scratch. There are some shops that can provide better quality equipment but they are few and far between. The following are the qualities that can be applied to standard weapons and armor; Greater, Superior, Supreme and Mastercraft.'
    ),
    p(
      'Greater. This item is made with fine materials and metals. Weapons with this quality is counted as being 5x more expensive than their base price. Armor with this quality is counted as being 50% more expensive than their base price. Items with this quality has 5 Enhancement Seal slots that can be applied to them.'
    ),
    p(
      'Superior. This item is made with rare materials generally only found in hostile environments such as active volcanoes, mines and caves miles underwater, and in ancient Shinobi or Sage ruins. Weapons with this quality is counted as being 7x more expensive than their base price. Armor with this quality is counted as being 70% more expensive than their base price. Items with this quality has 7 Enhancement Seal slots that can be applied to them.'
    ),
    p(
      'Supreme. This item is made with endangered materials generally only found in A and S-Rank hostile environments such as active volcano\'s miles underwater, guarded by exiled sage beasts or ancient Sage ruins protected by powerful Sage art barriers. Crafting an item of this quality requires Expertise with the required Tool Kit. Weapons with this quality is counted as being 10x more expensive than their base price. Armor with this quality is counted as being 100% more expensive than their base price. Items with this quality has 9 Enhancement Seal slots that can be applied to them.'
    ),
    p(
      'Mastercraft. This item is made with materials generally only provided by extraplanar creatures such as Sage Beasts, Demons, Devils or even Ōtsutsuki. Very, very few Items with this quality has ever been seen or used, with even less being made by Shinobi hands. Crafting an item of this quality requires 3 creatures with Expertise with the Crafting Skill and the required Tool Kit. Weapons with this quality is counted as being 15x more expensive than their base price. Armor with this quality is counted as being 150% more expensive than their base price. Items with this quality has 11 Enhancement Seal slots that can be applied to them.'
    ),
    t('Variant: Weaponsmith Kit', ['Item', 'Swift Craft DC', 'Charges', 'Bonus Effect', 'Cost'], [
      ['Weaponsmith Kit', '24', '5', '—', '200 Ryo'],
      ['Greater Weaponsmith Kit', '22', '7', 'Gain a +1d4 bonus to all checks made to create Weapons or Weapon Seals.', '450 Ryo'],
      ['Superior Weaponsmith Kit', '20', '9', 'Gain a +1d4 bonus to all checks made to create Weapons or Weapon Seals and increase the per week Market value contribution on items you are crafting with this kit by 100 Ryo.', '750 Ryo'],
      ['Supreme Weaponsmith Kit', '18', '12', 'Gain a +1d4 bonus to all checks made to create Weapons or Weapon Seals, increase the per week Market value contribution on items you are crafting with this kit by 150 Ryo and when you make a Swift Craft check, increase the Ryo Bonus to 200 for every +3 you get over the listed DC.', '1000 Ryo']
    ]),
    t('Variant: Armorsmith Kit', ['Item', 'Swift Craft DC', 'Charges', 'Bonus Effect', 'Cost'], [
      ['Armorsmith Kit', '24', '5', '—', '200 Ryo'],
      ['Greater Armorsmith Kit', '22', '7', 'Gain a +1d4 bonus to all checks made to create Armor or Armor Seals.', '450 Ryo'],
      ['Superior Armorsmith Kit', '20', '9', 'Gain a +1d4 bonus to all checks made to create Armor or Armor Seals and increase the per week Market value contribution on items you are crafting with this kit by 100 Ryo.', '750 Ryo'],
      ['Supreme Armorsmith Kit', '18', '12', 'Gain a +1d4 bonus to all checks made to create Armor or Armor Seals, increase the per week Market value contribution on items you are crafting with this kit by 150 Ryo and when you make a Swift Craft check, increase the Ryo Bonus to 200 for every +3 you get over the listed DC.', '1000 Ryo']
    ])
  ]
};

const CHAKRA_ENHANCED: DowntimeCategory['activities'][number] = {
  id: 'crafting-chakra-enhanced',
  tileLabel: 'Chakra-enhanced items',
  modalTitle: 'Crafting chakra-enhanced items',
  blocks: [
    p(
      'You can craft Chakra Enhanced objects, including Jutsu Scrolls and Chakra-Enhanced Weapons. You must be proficient with a Weaponsmith Kit or Armorsmith Kit and be able to access a Sealsmith Forge. A Sealsmith Forge is a special location dedicated towards modifying and augmenting normally mundane weapons and tools.\n\nThe process to create a Chakra enhanced item can feel long or arduous. While unlike normal crafting where you need raw materials and a forge to melt down different materials to get the required results, this is less of an art and more focused in the realm of both alchemy and science. When you want to craft a chakra enhanced item you must first begin to decide on how you wish to upgrade this weapon by spending 1 Downtime (DT) to find the required materials for the Seal you wish to carve into your weapon or armor.'
    ),
    h('Enhancement seal'),
    p(
      'An Enhancement Seal is a special form of Fuinjutsu that combine blacksmithing with Ninshou seal weaving. Enhancement Seals are what make chakra enhanced weapons so special. All base mundane weapons and armor have the potential to have up to 3 Seals imbued upon them. This seal allotment is coequally known as Seal Slots.\n\nThese Seals are organized in the standard Rank System that proliferates the Shinobi World of D-Rank all the way up to S-Rank. Each seal tier have their own list of Seal, their own Ryo Cost, and some seals even increase the difficulty to infuse them onto your item of choice.\n\nMuch like Ninjutsu, shinobi must be of appropriate level in order to utilize and in many cases, even wield Chakra Enhanced weapons. In order to wield these weapons, you must be of the appropriate level. If even one seal infused on your weapon is of a higher rank, the weapon is counted as the highest rank imbued on it.\n\nWhile most seals do not increase difficulty there is a standard Difficulty level based on the Rank of the chosen seal.\n\nUnlike normal Crafting when you are imbuing an item if you fail the Ability check, you don’t lose out on all the material or cost, you instead lose time. You waste the Downtime spent working on the item, and must commit at least half of the listed time again towards recreating the seals. With an Enhancement seal, you must be mindful of a few restrictions;\n\n• Seals of the same name, do not stack, unless otherwise stated.\n\n• For further clarification, classifications such as (Minor), (Refined) or (Mastercraft) are Not treated as a part of the seals name. So, you cannot stack the benefits of a Seal with the same name, with or without different classifications under any circumstance.\n\n• Seals of different names, do stack.\n\n• Your new armor/weapon carries the same Downtime cost as the highest ranked seal being imbued on your item.\n\n• Regardless of who makes this item, if the wielder is not of the appropriate level, they do not gain proficiency with the weapon regardless of outside features of effects. Additionally, if it is armor, they do not gain the benefit of the armor’s new effects.\n\n• You must be proficient with the imbued item in order to use it effectively.\n\nSeals of different ranks, occupy more of your weapons or armors seal slots based on the rank of the seal. So be sure to plan ahead.\n\nFinally, different seals regardless of rank carry their own Ryo cost to have them imbued. Normally the cost located in the Seals description is how much the seals materials cost in the market place for you to craft yourself. But if you wish to pay for someone else, such as a Sealsmith to imbue your weapons for you, there is a premium on this service. Increase the cost of your chosen seal(s) by 50%.'
    ),
    t('Enhancement seal minimum level requirement', ['Item Rank', 'Minimum Level'], [
      ['D-Rank', 'Level 1+'],
      ['C-Rank', 'Level 5+'],
      ['B-Rank', 'Level 9+'],
      ['A-Rank', 'Level 13+'],
      ['S-Rank', 'Level 17+']
    ]),
    t('Enhancement seal crafting DC', ['Item Rank', 'Minimum Crafting DC'], [
      ['D-Rank', '14'],
      ['C-Rank', '18'],
      ['B-Rank', '22'],
      ['A-Rank', '26'],
      ['S-Rank', '30']
    ]),
    t('Enhancement seal slot allotment', ['Enhancement Rank', 'Slots used'], [
      ['D-Rank', '1'],
      ['C-Rank', '2'],
      ['B-Rank', '3'],
      ['A-Rank', '4'],
      ['S-Rank', '5']
    ]),
    t('Chakra enhanced item downtime cost', ['Item Rank', 'Downtime Cost'], [
      ['D-Rank', '2 Weeks'],
      ['C-Rank', '4 Weeks'],
      ['B-Rank', '8 Weeks'],
      ['A-Rank', '16 Weeks'],
      ['S-Rank', '32 Weeks']
    ])
  ]
};

export const CRAFTING_CATEGORY: DowntimeCategory = {
  id: 'crafting',
  label: 'Crafting',
  activities: [
    CRAFTING_NON_ENHANCED,
    ARMOR_WEAPON_QUALITIES,
    CHAKRA_ENHANCED,
    WEAPON_SEALS_ACTIVITY,
    ARMOR_SEALS_ACTIVITY
  ]
};
