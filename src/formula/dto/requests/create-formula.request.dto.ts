import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, Length, IsUUID, ValidateNested } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { VALIDATION_CONSTANTS } from '@/core/constants';

export class ParentDto {
  @ApiPropertyOptional({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'formula.parentId' }),
  })
  id?: string;

  @ApiProperty({ example: 'Thunder Sr.' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'formula.parentName' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'formula.parentName' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_NAME_LENGTH, VALIDATION_CONSTANTS.MAX_NAME_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'formula.parentName' }),
  })
  name!: string;
}

export class CreateFormulaRequestDto {
  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => ParentDto)
  father!: ParentDto;

  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => ParentDto)
  mother!: ParentDto;

  @ApiPropertyOptional({ example: 'CASE123' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'formula.caseNumber' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_CASE_LENGTH, VALIDATION_CONSTANTS.MAX_CASE_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'formula.caseNumber' }),
  })
  caseNumber?: string;

  @ApiProperty({ example: '2024' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'formula.yearOfFormula' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'formula.yearOfFormula' }),
  })
  @Length(VALIDATION_CONSTANTS.YEAR_LENGTH, VALIDATION_CONSTANTS.YEAR_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'formula.yearOfFormula' }),
  })
  yearOfFormula!: string;
}
