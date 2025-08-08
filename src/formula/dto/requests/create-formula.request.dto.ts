import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, Length, ValidateNested } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { VALIDATION_CONSTANTS } from '@/core/constants';
import { IsFirebaseId } from '@/core/validators/firebase-id.validator';

export class ParentDto {
  @ApiProperty({ example: '-OV8mQOynkCqfL7wYRxN' })
  @Expose()
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'formula.parentId' }),
  })
  @IsFirebaseId({
    message: i18n('validation.IsFirebaseId', { path: 'app', property: 'formula.parentId' }),
  })
  id!: string;

  @ApiPropertyOptional({ example: 'Thunder Sr.' })
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
