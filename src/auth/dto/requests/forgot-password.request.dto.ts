import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';
import { AUTH_CONSTANTS } from '@/auth/constants/auth.constants';

export class ForgotPasswordRequestDto {
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
}

export class VerifyOTPRequestDto {
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

  @ApiProperty({ example: '12345' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.otp' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.otp' }),
  })
  @Length(AUTH_CONSTANTS.OTP_LENGTH, AUTH_CONSTANTS.OTP_LENGTH, {
    message: i18n('validation.OTPLength', { path: 'app', property: 'auth.otp' }),
  })
  otp!: string;
}

export class ResetPasswordRequestDto {
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

  @ApiProperty({ example: '12345' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.otp' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.otp' }),
  })
  @Length(AUTH_CONSTANTS.OTP_LENGTH, AUTH_CONSTANTS.OTP_LENGTH, {
    message: i18n('validation.OTPLength', { path: 'app', property: 'auth.otp' }),
  })
  otp!: string;

  @ApiProperty({ example: '1234' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.newPassword' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.newPassword' }),
  })
  @Length(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, AUTH_CONSTANTS.MAX_PASSWORD_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'auth.newPassword' }),
  })
  @Matches(/^\d+$/, {
    message: i18n('validation.NumbersOnly', { path: 'app', property: 'auth.newPassword' }),
  })
  newPassword!: string;

  @ApiProperty({ example: '1234' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.confirmPassword' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.confirmPassword' }),
  })
  @Length(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, AUTH_CONSTANTS.MAX_PASSWORD_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'auth.confirmPassword' }),
  })
  @Matches(/^\d+$/, {
    message: i18n('validation.NumbersOnly', { path: 'app', property: 'auth.confirmPassword' }),
  })
  confirmPassword!: string;
}
