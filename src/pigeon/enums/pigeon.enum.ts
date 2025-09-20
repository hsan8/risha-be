import { ObjectValues } from '@/core/types';

export const PigeonGender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;

export type PigeonGender = ObjectValues<typeof PigeonGender>;

export const PigeonHealthStatus = {
  HEALTHY: 'Healthy',
  SICK: 'Sick',
  RECOVERING: 'Recovering',
  QUARANTINE: 'Quarantine',
} as const;

export type PigeonHealthStatus = ObjectValues<typeof PigeonHealthStatus>;

export const PigeonBreed = {
  HOMING: 'Homing',
  RACING: 'Racing',
  FANCY: 'Fancy',
  UTILITY: 'Utility',
  WILD: 'Wild',
} as const;
export type PigeonBreed = ObjectValues<typeof PigeonBreed>;

export const PigeonStatus = {
  ALIVE: 'ALIVE',
  DEAD: 'DEAD',
  SOLD: 'SOLD',
} as const;

export type PigeonStatus = ObjectValues<typeof PigeonStatus>;
