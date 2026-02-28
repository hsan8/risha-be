import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class UpdateProfileRequestDto {
  @ApiPropertyOptional({ example: 'Hassan Dhaouadi' })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'user.name' }),
  })
  @Length(1, 200, {
    message: i18n('validation.Length', { path: 'app', property: 'user.name' }),
  })
  name?: string;

  @ApiPropertyOptional({ example: 'dhaouadi002@gmail.com' })
  @Expose()
  @IsOptional()
  @IsEmail(
    {},
    {
      message: i18n('validation.IsEmail', { path: 'app', property: 'user.email' }),
    },
  )
  email?: string;

  @ApiPropertyOptional({ example: '65774335' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'user.phone' }),
  })
  phone?: string;

  @ApiPropertyOptional({ example: 'ميدان حولي' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'user.address' }),
  })
  address?: string;

  @ApiPropertyOptional({ example: 'Kuwait' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'user.country' }),
  })
  country?: string;

  @ApiPropertyOptional({ example: 'https://avatar.url/user.jpg' })
  @Expose()
  @IsOptional()
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'user.avatar' }),
  })
  avatar?: string;
}
