import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsDateString, Length, IsUUID, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { PigeonGender, PigeonStatus } from '../../enums/pigeon.enum';
import { VALIDATION_CONSTANTS } from '@/core/constants';

export class UpdatePigeonRequestDto {
  @ApiPropertyOptional({ example: 'Blue Thunder' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.name' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_NAME_LENGTH, VALIDATION_CONSTANTS.MAX_NAME_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.name' }),
  })
  name!: string;

  @ApiProperty({ enum: PigeonGender, example: PigeonGender.MALE })
  @Expose()
  @IsEnum(PigeonGender, {
    message: i18n('validation.IsEnum', { path: 'app', property: 'pigeon.gender' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.gender' }),
  })
  gender!: PigeonGender;

  @ApiProperty({ enum: PigeonStatus, example: PigeonStatus.ALIVE })
  @Expose()
  @IsEnum(PigeonStatus, {
    message: i18n('validation.IsEnum', { path: 'app', property: 'pigeon.status' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.status' }),
  })
  status: PigeonStatus = PigeonStatus.ALIVE;

  @ApiPropertyOptional({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'pigeon.ownerId' }),
  })
  ownerId?: string;

  @ApiPropertyOptional({ example: '2024-A-001' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.documentationNo' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_DOCUMENTATION_LENGTH, VALIDATION_CONSTANTS.MAX_DOCUMENTATION_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.documentationNo' }),
  })
  documentationNo?: string;

  @ApiPropertyOptional({ example: 'RN123' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.ringNo' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_RING_LENGTH, VALIDATION_CONSTANTS.MAX_RING_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.ringNo' }),
  })
  ringNo?: string;

  @ApiPropertyOptional({ example: 'Blue' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.ringColor' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_RING_LENGTH, VALIDATION_CONSTANTS.MAX_RING_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.ringColor' }),
  })
  ringColor?: string;

  @ApiPropertyOptional({ example: 'CASE123' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.caseNumber' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_CASE_LENGTH, VALIDATION_CONSTANTS.MAX_CASE_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.caseNumber' }),
  })
  caseNumber?: string;

  @ApiPropertyOptional({ example: 'Thunder Sr.' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.fatherName' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_PARENT_NAME_LENGTH, VALIDATION_CONSTANTS.MAX_PARENT_NAME_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.fatherName' }),
  })
  fatherName?: string;

  @ApiPropertyOptional({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'pigeon.fatherId' }),
  })
  fatherId?: string;

  @ApiPropertyOptional({ example: 'Silver Star' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.motherName' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_PARENT_NAME_LENGTH, VALIDATION_CONSTANTS.MAX_PARENT_NAME_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.motherName' }),
  })
  motherName?: string;

  @ApiPropertyOptional({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'pigeon.motherId' }),
  })
  motherId?: string;

  @ApiPropertyOptional({ example: '2023' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  @Length(VALIDATION_CONSTANTS.YEAR_LENGTH, VALIDATION_CONSTANTS.YEAR_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  yearOfBirth?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsDateString(
    {},
    {
      message: i18n('validation.IsDateString', { path: 'app', property: 'pigeon.deadAt' }),
    },
  )
  deadAt?: string;
}
