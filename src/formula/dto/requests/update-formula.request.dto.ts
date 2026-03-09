import { VALIDATION_CONSTANTS } from '@/core/constants';
import { FORMULA_CONSTANTS } from '@/formula/constants';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class UpdateFormulaRequestDto {
  @ApiPropertyOptional({ example: '12', description: 'Box number (1–10 characters)' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'formula.boxNumber' }),
  })
  @Length(FORMULA_CONSTANTS.MIN_BOX_NUMBER_LENGTH, FORMULA_CONSTANTS.MAX_BOX_NUMBER_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'formula.boxNumber' }),
  })
  boxNumber?: string;

  @ApiPropertyOptional({ example: '2024', description: 'Year of formula (4 digits)' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'formula.yearOfFormula' }),
  })
  @Length(VALIDATION_CONSTANTS.YEAR_LENGTH, VALIDATION_CONSTANTS.YEAR_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'formula.yearOfFormula' }),
  })
  yearOfFormula?: string;
}
