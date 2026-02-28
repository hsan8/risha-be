import { ObjectValues } from '@/core/types';

export const NewsItemType = {
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  NEWS: 'NEWS',
  AUCTIONS: 'AUCTIONS',
  MATCHES: 'MATCHES',
} as const;

export type NewsItemType = ObjectValues<typeof NewsItemType>;
