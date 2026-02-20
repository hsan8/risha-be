import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { ArchiveReason } from '../../enums';

export class ArchivePigeonRequestDto {
  @ApiProperty({
    enum: ArchiveReason,
    example: ArchiveReason.SOLD,
    description: 'Reason for archiving: SOLD, GIFT, TRANSFER_OWNERSHIP, or DEAD',
  })
  @Expose()
  @IsEnum(ArchiveReason, {
    message: i18n('validation.IsEnum', { path: 'app', property: 'archive.reason' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'archive.reason' }),
  })
  reason!: ArchiveReason;

  @ApiPropertyOptional({ example: 'Sold to breeder', description: 'Optional note' })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @ApiPropertyOptional({
    example: '-OkJ123abc',
    description: 'New owner user ID when sharing data with new owner',
  })
  @Expose()
  @IsOptional()
  @IsString()
  newOwnerId?: string;
}
