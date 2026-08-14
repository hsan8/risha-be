import { AUTH_CONSTANTS } from '@/auth/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class ChangePasswordRequestDto {
  @ApiProperty({ example: '12345' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'user.oldPassword' }),
  })
  @Length(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, AUTH_CONSTANTS.MAX_PASSWORD_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'user.oldPassword' }),
  })
  oldPassword: string;

  @ApiProperty({ example: '23456' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'user.newPassword' }),
  })
  @Length(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, AUTH_CONSTANTS.MAX_PASSWORD_LENGTH, {
    message: i18n('validation.Length', { path: 'app', property: 'user.newPassword' }),
  })
  newPassword: string;
}
