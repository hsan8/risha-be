import { IsString, IsEmail, IsOptional, Length, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { VALIDATION_CONSTANTS } from '@/core/constants';
import { AUTH_CONSTANTS } from '@/auth/constants';

export class RegisterRequestDto {
  @ApiProperty({ example: 'أحمد محمد' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.name' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.name' }),
  })
  @Length(VALIDATION_CONSTANTS.MIN_NAME_LENGTH, VALIDATION_CONSTANTS.MAX_NAME_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'auth.name' }),
  })
  name!: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  @Transform(({ value }) => value?.trim?.().toLowerCase() ?? value)
  @IsEmail(
    {},
    {
      message: i18n('validation.IsEmail', { path: 'app', property: 'auth.email' }),
    },
  )
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.email' }),
  })
  email!: string;

  @ApiProperty({ example: '1234' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.password' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.password' }),
  })
  @Length(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, AUTH_CONSTANTS.MAX_PASSWORD_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'auth.password' }),
  })
  @Matches(/^\d+$/, {
    message: i18n('validation.NumbersOnly', { path: 'app', property: 'auth.password' }),
  })
  password!: string;

  @ApiProperty({ example: '+96512345678', required: false })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const trimmed = value.trim();
    // If phone number doesn't start with +965, add it
    if (trimmed && !trimmed.startsWith('+965') && /^\d{8}$/.test(trimmed)) {
      return `+965${trimmed}`;
    }
    return trimmed;
  })
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.phone' }),
  })
  @Matches(/^\+965[0-9]{8}$/, {
    message: i18n('validation.KuwaitPhoneFormat', { path: 'app', property: 'auth.phone' }),
  })
  phone?: string;

  @ApiProperty({ example: 'Kuwait', required: false })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? 'Kuwait')
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.country' }),
  })
  country?: string;
}
