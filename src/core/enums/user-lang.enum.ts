import { ValueOf } from '../utilities';

export const UserLang = {
  ENGLISH: 'en',
  ARABIC: 'ar',
} as const;

export type UserLang = ValueOf<typeof UserLang>;
