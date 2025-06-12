import { ValueOf } from '@app/core/utilities';

export const SyncingWithTrxStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
} as const;

export type SyncingWithTrxStatus = ValueOf<typeof SyncingWithTrxStatus>;
