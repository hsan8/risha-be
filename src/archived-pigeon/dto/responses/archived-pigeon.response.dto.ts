import { PigeonResponseDto } from '@/pigeon/dto/responses';
import { Pigeon } from '@/pigeon/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import moment from 'moment';
import { ArchivedPigeon } from '../../entities';
import { IArchivedHistoryEventRaw, IArchivedPigeonRaw } from '../../interfaces';

export class ArchivedHistoryEventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventType: string;

  @ApiProperty({ example: '2025-02-01T12:00:00.000Z' })
  eventDate: Date;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty({ example: '2025-02-01T12:00:00.000Z' })
  createdAt: Date;

  constructor(raw: IArchivedHistoryEventRaw) {
    this.id = raw.id;
    this.eventType = raw.eventType;
    this.eventDate = moment(raw.eventDate).toDate();
    this.note = raw.note ?? undefined;
    this.createdAt = moment(raw.createdAt).toDate();
  }
}

export class ArchivedPigeonResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  originalPigeonId: string;

  @ApiProperty({ enum: ['SOLD', 'GIFT', 'TRANSFER_OWNERSHIP', 'DEAD'] })
  archiveReason: string;

  @ApiProperty({ example: '2025-02-01T12:00:00.000Z' })
  archivedAt: Date;

  @ApiProperty({ type: () => PigeonResponseDto })
  pigeonSnapshot: PigeonResponseDto;

  @ApiProperty({ type: [ArchivedHistoryEventResponseDto], description: 'History events bundled with this archive' })
  historyRecords: ArchivedHistoryEventResponseDto[];

  @ApiPropertyOptional()
  note?: string;

  @ApiPropertyOptional()
  newOwnerId?: string;

  constructor(archived: ArchivedPigeon | IArchivedPigeonRaw) {
    const isRaw = typeof (archived as IArchivedPigeonRaw).archivedAt === 'string';
    const raw = archived as IArchivedPigeonRaw;
    const entity = archived as ArchivedPigeon;

    this.id = archived.id;
    this.originalPigeonId = archived.originalPigeonId;
    this.archiveReason = archived.archiveReason;
    this.archivedAt = isRaw ? moment(raw.archivedAt).toDate() : entity.archivedAt;
    this.pigeonSnapshot = new PigeonResponseDto((isRaw ? raw.pigeonSnapshot : entity.pigeonSnapshot) as Pigeon);
    const historyRaw: IArchivedHistoryEventRaw[] = isRaw
      ? (raw.historyRecords ?? [])
      : (entity.historyRecords ?? []).map((e) => ({
          id: e.id,
          pigeonId: e.pigeonId,
          userId: e.userId,
          eventType: e.eventType,
          eventDate: moment(e.eventDate).toISOString(),
          note: e.note ?? null,
          createdAt: moment(e.createdAt).toISOString(),
        }));
    this.historyRecords = historyRaw.map((e) => new ArchivedHistoryEventResponseDto(e));
    this.note = isRaw ? raw.note ?? undefined : entity.note;
    this.newOwnerId = isRaw ? raw.newOwnerId ?? undefined : entity.newOwnerId;
  }
}
