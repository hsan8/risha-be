import { VALIDATION_CONSTANTS } from '@/core/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length, ValidateIf, ValidateNested } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class ParentDto {
  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Parent pigeon ID (optional if name is provided)' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'formula.parentId' }),
  })
  id?: string;

  @ApiPropertyOptional({ example: 'Thunder Sr.', description: 'Parent pigeon name (optional if id is provided)' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'formula.parentName' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_NAME_LENGTH, VALIDATION_CONSTANTS.MAX_NAME_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'formula.parentName' }),
  })
  name?: string;
}

export class CreateFormulaRequestDto {
  @ApiPropertyOptional({ description: 'Father pigeon (use when not sending maleId)' })
  @Expose()
  @ValidateIf((o) => !o.maleId)
  @ValidateNested()
  @Type(() => ParentDto)
  father?: ParentDto;

  @ApiPropertyOptional({ description: 'Mother pigeon (use when not sending femaleId)' })
  @Expose()
  @ValidateIf((o) => !o.femaleId)
  @ValidateNested()
  @Type(() => ParentDto)
  mother?: ParentDto;

  @ApiPropertyOptional({ description: 'Male (father) pigeon ID; alternative to father object' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'formula.maleId' }),
  })
  maleId?: string;

  @ApiPropertyOptional({ description: 'Female (mother) pigeon ID; alternative to mother object' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'formula.femaleId' }),
  })
  femaleId?: string;

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
