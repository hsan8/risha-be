import { ValueOf } from '@app/core/utilities';

export const CurrencyISO = {
  KWD: 'KWD',
} as const;

export type CurrencyISO = ValueOf<typeof CurrencyISO>;
