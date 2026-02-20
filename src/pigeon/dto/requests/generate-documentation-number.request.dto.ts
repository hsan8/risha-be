import { VALIDATION_CONSTANTS } from '@/core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import moment from 'moment';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class GenerateDocumentationNumberRequestDto {
  @ApiProperty({ example: '2025', minimum: VALIDATION_CONSTANTS.MIN_YEAR, maximum: moment().year() })
  @Expose()
  @Transform(({ value }) => (value?.trim?.() ? parseInt(value, 10) : value))
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  @IsInt({
    message: i18n('validation.IsInt', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  @Min(VALIDATION_CONSTANTS.MIN_YEAR, {
    message: i18n('validation.Min', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  @Max(moment().year(), {
    message: i18n('validation.Max', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  yearOfBirth!: number;
}
