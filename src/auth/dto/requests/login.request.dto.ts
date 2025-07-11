import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class LoginRequestDto {
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
  password!: string;
}
