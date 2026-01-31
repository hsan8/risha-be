import { ApiProperty } from '@nestjs/swagger';
import { HistoryEvent } from '../../entities';
import { HistoryEventType } from '../../enums';

export class HistoryEventResponseDto {
  @ApiProperty({ example: '-OkIZUqlf5UDegR1s-53' })
  id: string;

  @ApiProperty({ example: '-OkIZUqlf5UDegR1s-53' })
  pigeonId: string;

  @ApiProperty({ enum: HistoryEventType, example: HistoryEventType.FORMULA_CREATED })
  eventType: HistoryEventType;

  @ApiProperty({ example: 'تم تسجيل الفرخ بتاريخ :' })
  label: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  eventDate: Date;

  @ApiProperty({ example: 'Optional note', nullable: true })
  note: string | null;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: Date;

  constructor(event: HistoryEvent, label: string) {
    this.id = event.id;
    this.pigeonId = event.pigeonId;
    this.eventType = event.eventType;
    this.label = label;
    this.eventDate = event.eventDate;
    this.note = event.note ?? null;
    this.createdAt = event.createdAt;
  }
}
