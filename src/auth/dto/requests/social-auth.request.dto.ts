import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MinLength } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class GoogleAuthRequestDto {
  @ApiProperty({ example: '4/0AeD...', description: 'PKCE: authorization code' })
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.code' }) })
  code: string;

  @ApiProperty({
    example: 'wYztjmC8K4k1niXZRoFxUOkHvc4IZUEr1yiC0meMim0',
    description: 'PKCE: code verifier',
  })
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.codeVerifier' }) })
  @MinLength(43, { message: i18n('validation.MinLength', { path: 'app', property: 'auth.codeVerifier', min: 43 }) })
  codeVerifier: string;

  @ApiProperty({ example: 'https://auth.expo.io/@user/PIGEON-APP', description: 'PKCE: redirect URI' })
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.redirectUri' }) })
  @IsUrl({}, { message: i18n('validation.IsUrl', { path: 'app', property: 'auth.redirectUri' }) })
  redirectUri: string;
}
