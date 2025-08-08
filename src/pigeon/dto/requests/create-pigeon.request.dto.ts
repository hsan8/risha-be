import { IsString, IsEnum, IsOptional, IsDateString, Length, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { PigeonGender, PigeonStatus } from '@/pigeon/enums';
import { VALIDATION_CONSTANTS } from '@/core/constants';

export class CreatePigeonRequestDto {
  @ApiProperty({ example: 'Blue Thunder' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.name' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.name' }),
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

  @ApiPropertyOptional({ enum: PigeonStatus, example: PigeonStatus.ALIVE })
  @Expose()
  @IsOptional()
  @IsEnum(PigeonStatus, {
    message: i18n('validation.IsEnum', { path: 'app', property: 'pigeon.status' }),
  })
  status?: PigeonStatus = PigeonStatus.ALIVE;

  @ApiPropertyOptional({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'pigeon.ownerId' }),
  })
  ownerId?: string;

  @ApiProperty({ example: '2024-A-001' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.documentationNo' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.documentationNo' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_DOCUMENTATION_LENGTH, VALIDATION_CONSTANTS.MAX_DOCUMENTATION_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.documentationNo' }),
  })
  documentationNo!: string;

  @ApiProperty({ example: 'RN123' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.ringNo' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.ringNo' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_RING_LENGTH, VALIDATION_CONSTANTS.MAX_RING_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.ringNo' }),
  })
  ringNo!: string;

  @ApiProperty({ example: 'Blue' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.ringColor' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.ringColor' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_RING_LENGTH, VALIDATION_CONSTANTS.MAX_RING_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.ringColor' }),
  })
  ringColor!: string;

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

  @ApiProperty({ example: 'Thunder Sr.' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.fatherName' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.fatherName' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_PARENT_NAME_LENGTH, VALIDATION_CONSTANTS.MAX_PARENT_NAME_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.fatherName' }),
  })
  fatherName!: string;

  @ApiPropertyOptional({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'pigeon.fatherId' }),
  })
  fatherId?: string;

  @ApiProperty({ example: 'Storm' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.motherName' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.motherName' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_PARENT_NAME_LENGTH, VALIDATION_CONSTANTS.MAX_PARENT_NAME_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.motherName' }),
  })
  motherName!: string;

  @ApiPropertyOptional({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  @Expose()
  @IsOptional()
  @IsUUID('4', {
    message: i18n('validation.IsUUID', { path: 'app', property: 'pigeon.motherId' }),
  })
  motherId?: string;

  @ApiProperty({ example: '2023' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  @Length(VALIDATION_CONSTANTS.YEAR_LENGTH, VALIDATION_CONSTANTS.YEAR_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'pigeon.yearOfBirth' }),
  })
  yearOfBirth!: string;

  @ApiPropertyOptional({ example: '2024-12-01T10:30:00Z' })
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
