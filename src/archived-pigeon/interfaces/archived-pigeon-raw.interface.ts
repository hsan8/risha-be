import { ArchiveReason } from '../enums';

/** One history event as stored in the archived bundle (dates as ISO strings). */
export interface IArchivedHistoryEventRaw {
  id: string;
  pigeonId: string;
  userId: string;
  eventType: string;
  eventDate: string;
  note?: string | null;
  createdAt: string;
}

/** Shape of an archived pigeon as stored / read from Firebase (dates as ISO strings, nulls for optional). */
export interface IArchivedPigeonRaw {
  id: string;
  originalPigeonId: string;
  userId: string;
  archiveReason: ArchiveReason;
  archivedAt: string;
  pigeonSnapshot: Record<string, unknown>;
  /** Present when archived with bundle; older records may lack this. */
  historyRecords?: IArchivedHistoryEventRaw[];
  note?: string | null;
  newOwnerId?: string | null;
}
