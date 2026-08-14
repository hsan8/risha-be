import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class AppleFullNameDto {
  @ApiPropertyOptional({ example: 'Dhaouadi' })
  @IsOptional()
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.givenName' }) })
  givenName?: string | null;

  @ApiPropertyOptional({ example: 'Hassan' })
  @IsOptional()
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.familyName' }) })
  familyName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  middleName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  namePrefix?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  nameSuffix?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  nickname?: string | null;
}

export class AppleAuthRequestDto {
  @ApiProperty({ description: 'Apple identity token (JWT)' })
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.identityToken' }) })
  identityToken: string;

  @ApiPropertyOptional({ description: 'Apple authorization code' })
  @IsOptional()
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.authorizationCode' }) })
  authorizationCode?: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'Email (only provided on first sign-in)' })
  @IsOptional()
  @IsEmail({}, { message: i18n('validation.IsEmail', { path: 'app', property: 'auth.email' }) })
  email?: string;

  @ApiPropertyOptional({ description: 'Full name (only provided on first sign-in)' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AppleFullNameDto)
  fullName?: AppleFullNameDto | null;
}
