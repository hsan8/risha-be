import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { HistoryEventType } from '../enums';

export class HistoryEvent {
  @ApiProperty({ description: 'Unique identifier for the history event' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Pigeon ID this event belongs to' })
  @IsString()
  pigeonId: string;

  @ApiProperty({ description: 'User ID (owner)' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Type of event', enum: HistoryEventType })
  @IsEnum(HistoryEventType)
  eventType: HistoryEventType;

  @ApiProperty({ description: 'Date when the event occurred' })
  @IsDate()
  eventDate: Date;

  @ApiProperty({ description: 'Optional note', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'When the record was created' })
  @IsDate()
  createdAt: Date;
}
