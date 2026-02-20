import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { HistoryEventType } from '../../enums';

export class CreateHistoryEventRequestDto {
  @ApiProperty({ enum: HistoryEventType, example: HistoryEventType.FORMULA_CREATED })
  @Expose()
  @IsEnum(HistoryEventType, {
    message: i18n('validation.IsEnum', { path: 'app', property: 'history.eventType' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'history.eventType' }),
  })
  eventType!: HistoryEventType;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  @Expose()
  @IsDateString(
    {},
    {
      message: i18n('validation.IsDateString', { path: 'app', property: 'history.eventDate' }),
    },
  )
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'history.eventDate' }),
  })
  eventDate!: string;

  @ApiPropertyOptional({ example: 'Optional note' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'history.note' }),
  })
  @MaxLength(500, {
    message: i18n('validation.MaxLength', { path: 'app', property: 'history.note' }),
  })
  note?: string;
}
