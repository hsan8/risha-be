import { ObjectValues } from '../types';

/** Supported app languages: Arabic (default) and English */
export const UserLocale = {
  ARABIC: 'ar',
  ENGLISH: 'en',
} as const;

export type UserLocale = ObjectValues<typeof UserLocale>;

/** Supported locale codes (for iteration / validation) */
export const SUPPORTED_LOCALES: readonly UserLocale[] = [UserLocale.ARABIC, UserLocale.ENGLISH] as const;

/** Default locale when none is provided (e.g. missing header) */
export const DEFAULT_LOCALE: UserLocale = UserLocale.ARABIC;

/** Normalize raw header/query value to a supported locale; otherwise default (Arabic) */
export function normalizeToSupportedLocale(value: string | undefined): UserLocale {
  const lang = value?.trim?.().toLowerCase?.().split('-')[0] ?? '';
  if (lang === UserLocale.ENGLISH) return UserLocale.ENGLISH;
  if (lang === UserLocale.ARABIC) return UserLocale.ARABIC;
  return DEFAULT_LOCALE;
}
