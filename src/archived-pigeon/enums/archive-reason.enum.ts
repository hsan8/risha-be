import { ObjectValues } from '@/core/types';

export const ArchiveReason = {
  SOLD: 'SOLD',
  GIFT: 'GIFT',
  TRANSFER_OWNERSHIP: 'TRANSFER_OWNERSHIP',
  DEAD: 'DEAD',
} as const;

export type ArchiveReason = ObjectValues<typeof ArchiveReason>;
