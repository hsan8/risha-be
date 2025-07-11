import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, Length, Matches, IsOptional } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { VALIDATION_CONSTANTS } from '@/core/constants/validation.constant';
import { AUTH_CONSTANTS } from '@/auth/constants/auth.constants';

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

  @ApiProperty({ example: '+966501234567', required: false })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.phone' }),
  })
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: i18n('validation.PhoneFormat', { path: 'app', property: 'auth.phone' }),
  })
  phone?: string;
}
