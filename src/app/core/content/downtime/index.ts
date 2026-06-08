import type { DowntimeCategory } from './model';
import { GENERAL_CATEGORY } from './general';
import { CRAFTING_CATEGORY } from './crafting';
import { JUTSU_CATEGORY } from './jutsu';
import { OTHER_ACTIVITIES_CATEGORY } from './other-activities';
import { TOOLKITS_CATEGORY } from './toolkits';

export type {
  DowntimeActivity,
  DowntimeCategory,
  DowntimeContentBlock
} from './model';

export const DOWNTIME_CATEGORIES: readonly DowntimeCategory[] = [
  GENERAL_CATEGORY,
  CRAFTING_CATEGORY,
  JUTSU_CATEGORY,
  OTHER_ACTIVITIES_CATEGORY,
  TOOLKITS_CATEGORY
];
