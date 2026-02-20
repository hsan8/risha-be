import { Pigeon } from '@/pigeon/entities';
import { ArchiveReason } from '../enums';

export interface ICreateArchivedPigeonData {
  originalPigeonId: string;
  userId: string;
  archiveReason: ArchiveReason;
  pigeonSnapshot: Pigeon;
  note?: string;
  newOwnerId?: string;
}
