import { ArchiveReason } from '../enums';

/** Shape of an archived pigeon as stored / read from Firebase (dates as ISO strings, nulls for optional). */
export interface IArchivedPigeonRaw {
  id: string;
  originalPigeonId: string;
  userId: string;
  archiveReason: ArchiveReason;
  archivedAt: string;
  pigeonSnapshot: Record<string, unknown>;
  note?: string | null;
  newOwnerId?: string | null;
}
