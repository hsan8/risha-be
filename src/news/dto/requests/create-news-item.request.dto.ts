import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { NewsItemType } from '../../enums';

export class CreateNewsItemRequestDto {
  @ApiProperty({ enum: NewsItemType, example: NewsItemType.ANNOUNCEMENT })
  @IsEnum(NewsItemType, {
    message: i18n('validation.IsEnum', { path: 'app', property: 'news.type' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'news.type' }),
  })
  type!: NewsItemType;

  @ApiProperty({ example: '2026-02-21T12:30:00.000Z' })
  @IsDateString(
    {},
    {
      message: i18n('validation.IsDateString', { path: 'app', property: 'news.dateTime' }),
    },
  )
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'news.dateTime' }),
  })
  dateTime!: string;

  @ApiProperty({ example: 'Your news text here...' })
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'news.description' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'news.description' }),
  })
  description!: string;
}
