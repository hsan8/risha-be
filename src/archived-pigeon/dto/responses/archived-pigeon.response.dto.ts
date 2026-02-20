import { PigeonResponseDto } from '@/pigeon/dto/responses';
import { Pigeon } from '@/pigeon/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import moment from 'moment';
import { ArchivedPigeon } from '../../entities';
import { IArchivedPigeonRaw } from '../../interfaces';

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
    this.note = isRaw ? raw.note ?? undefined : entity.note;
    this.newOwnerId = isRaw ? raw.newOwnerId ?? undefined : entity.newOwnerId;
  }
}
