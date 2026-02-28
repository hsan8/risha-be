import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { NewsItemType } from '../../enums';

export class UpdateNewsItemRequestDto {
  @ApiPropertyOptional({ enum: NewsItemType, example: NewsItemType.ANNOUNCEMENT })
  @IsOptional()
  @IsEnum(NewsItemType, {
    message: i18n('validation.IsEnum', { path: 'app', property: 'news.type' }),
  })
  type?: NewsItemType;

  @ApiPropertyOptional({ example: '2026-02-21T12:30:00.000Z' })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: i18n('validation.IsDateString', { path: 'app', property: 'news.dateTime' }),
    },
  )
  dateTime?: string;

  @ApiPropertyOptional({ example: 'Your news text here...' })
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'news.description' }),
  })
  description?: string;
}
