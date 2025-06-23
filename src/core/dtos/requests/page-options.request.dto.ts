import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

const MIN_PAGINATION_PAGE = 1;
const MAX_PAGINATION_PAGE = 1_000_000_000_000;
const MIN_PAGINATION_SIZE = 1;
const MAX_PAGINATION_SIZE = 50;
const DEFAULT_PAGINATION_PAGE = 1;
const DEFAULT_PAGINATION_SIZE = 10;

export class PageOptionsRequestDto {
  @ApiPropertyOptional({
    minimum: MIN_PAGINATION_PAGE,
    default: DEFAULT_PAGINATION_PAGE,
    example: DEFAULT_PAGINATION_PAGE,
    description: 'Pagination page',
  })
  @Max(MAX_PAGINATION_PAGE, { message: i18n('validation.Max', { path: 'general', property: 'paginationPage' }) })
  @Min(MIN_PAGINATION_PAGE, { message: i18n('validation.Min', { path: 'general', property: 'paginationPage' }) })
  @IsInt({ message: i18n('validation.IsInt', { path: 'general', property: 'paginationPage' }) })
  @IsNumber(
    { allowNaN: false },
    { message: i18n('validation.IsNumber', { path: 'general', property: 'paginationPage' }) },
  )
  @Transform(({ value }) => +value)
  page: number = DEFAULT_PAGINATION_PAGE;

  @ApiPropertyOptional({
    minimum: MIN_PAGINATION_SIZE,
    maximum: MAX_PAGINATION_SIZE,
    default: DEFAULT_PAGINATION_SIZE,
    example: DEFAULT_PAGINATION_SIZE,
    description: 'Pagination page size',
  })
  @Max(MAX_PAGINATION_SIZE, { message: i18n('validation.Max', { path: 'general', property: 'paginationSize' }) })
  @Min(MIN_PAGINATION_SIZE, { message: i18n('validation.Min', { path: 'general', property: 'paginationSize' }) })
  @IsInt({ message: i18n('validation.IsInt', { path: 'general', property: 'paginationSize' }) })
  @IsNumber(
    { allowNaN: false },
    { message: i18n('validation.IsNumber', { path: 'general', property: 'paginationSize' }) },
  )
  @Transform(({ value }) => +value)
  size: number = DEFAULT_PAGINATION_SIZE;
}
