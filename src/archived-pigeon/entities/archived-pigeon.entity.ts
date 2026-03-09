import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { HistoryEvent } from '@/history/entities';
import { Pigeon } from '@/pigeon/entities';
import { ArchiveReason } from '../enums';

export class ArchivedPigeon {
  @ApiProperty({ description: 'Unique identifier for the archived record' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Original pigeon ID when it was active' })
  @IsString()
  originalPigeonId: string;

  @ApiProperty({ description: 'User ID who owned the pigeon when archived' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Reason for archiving', enum: ArchiveReason })
  @IsEnum(ArchiveReason)
  archiveReason: ArchiveReason;

  @ApiProperty({ description: 'When the pigeon was archived' })
  @IsDate()
  archivedAt: Date;

  @ApiProperty({ description: 'Snapshot of the pigeon at archive time' })
  pigeonSnapshot: Pigeon;

  @ApiProperty({ description: 'History events for this pigeon at archive time', type: [Object] })
  @IsArray()
  historyRecords: HistoryEvent[];

  @ApiPropertyOptional({ description: 'Optional note' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'New owner user ID when data is shared' })
  @IsOptional()
  @IsString()
  newOwnerId?: string;
}
