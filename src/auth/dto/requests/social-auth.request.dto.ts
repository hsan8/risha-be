import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class GoogleAuthRequestDto {
  @ApiProperty({ example: 'google_id_token_here' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.idToken' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.idToken' }),
  })
  idToken!: string;
}

export class AppleAuthRequestDto {
  @ApiProperty({ example: 'apple_id_token_here' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.idToken' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.idToken' }),
  })
  idToken!: string;

  @ApiProperty({ example: 'apple_user_id_here' })
  @Expose()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.userId' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'auth.userId' }),
  })
  userId!: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  @Expose()
  @IsOptional()
  @IsEmail(
    {},
    {
      message: i18n('validation.IsEmail', { path: 'app', property: 'auth.email' }),
    },
  )
  email?: string;

  @ApiProperty({ example: 'أحمد محمد', required: false })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'auth.name' }),
  })
  name?: string;
}
