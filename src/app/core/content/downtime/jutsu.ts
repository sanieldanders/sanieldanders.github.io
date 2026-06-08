import type { DowntimeCategory } from './model';
import { JUTSU_CUSTOMIZE_ACTIVITY } from './jutsu-customize';
import { JUTSU_GENJUTSU_ACTIVITY } from './jutsu-genjutsu';
import { JUTSU_LEARNING_ACTIVITY } from './jutsu-learning';
import { JUTSU_NINJUTSU_ACTIVITY } from './jutsu-ninjutsu';
import { JUTSU_TAIJUTSU_ACTIVITY } from './jutsu-taijutsu';

export const JUTSU_CATEGORY: DowntimeCategory = {
  id: 'jutsu',
  label: 'Jutsu',
  activities: [
    JUTSU_LEARNING_ACTIVITY,
    JUTSU_NINJUTSU_ACTIVITY,
    JUTSU_GENJUTSU_ACTIVITY,
    JUTSU_TAIJUTSU_ACTIVITY,
    JUTSU_CUSTOMIZE_ACTIVITY
  ]
};
