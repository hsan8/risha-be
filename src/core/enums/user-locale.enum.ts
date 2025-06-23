import { ObjectValues } from '../types';

export const UserLocale = {
  ARABIC: 'ar',
  ENGLISH: 'en',
} as const;
export type UserLocale = ObjectValues<typeof UserLocale>;
