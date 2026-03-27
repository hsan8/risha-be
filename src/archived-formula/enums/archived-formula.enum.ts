import { ObjectValues } from '@/core/types';

export const ArchivedFormulaReason = {
  EGGS_DESTROYED: 'EGGS_DESTROYED',
  ARCHIVED_BY_USER: 'ARCHIVED_BY_USER',
  ALL_CHICKS_REGISTERED: 'ALL_CHICKS_REGISTERED',
} as const;

export type ArchivedFormulaReason = ObjectValues<typeof ArchivedFormulaReason>;
