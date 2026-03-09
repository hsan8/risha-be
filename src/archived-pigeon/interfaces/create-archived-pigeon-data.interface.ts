import { Pigeon } from '@/pigeon/entities';
import { HistoryEvent } from '@/history/entities';
import { ArchiveReason } from '../enums';

export interface ICreateArchivedPigeonData {
  originalPigeonId: string;
  userId: string;
  archiveReason: ArchiveReason;
  pigeonSnapshot: Pigeon;
  historyRecords: HistoryEvent[];
  note?: string;
  newOwnerId?: string;
}
