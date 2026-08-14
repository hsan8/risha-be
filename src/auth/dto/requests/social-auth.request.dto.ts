import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

/**
 * Supports three Google Sign-In flows:
 *  1. idToken      — mobile SDK (e.g. @react-native-google-signin): send { idToken }
 *  2. serverAuthCode — mobile SDK server-side exchange: send { serverAuthCode }
 *  3. PKCE code    — web / Expo managed: send { code, codeVerifier, redirectUri }
 */
export class GoogleAuthRequestDto {
  @ApiPropertyOptional({ example: 'eyJhb...', description: 'Google ID token from mobile SDK' })
  @IsOptional()
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.idToken' }) })
  idToken?: string;

  @ApiPropertyOptional({ example: '4/0AeD...', description: 'Server auth code from mobile SDK' })
  @IsOptional()
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.serverAuthCode' }) })
  serverAuthCode?: string;

  @ApiPropertyOptional({ example: '4/0AeD...', description: 'PKCE: authorization code' })
  @IsOptional()
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.code' }) })
  code?: string;

  @ApiPropertyOptional({
    example: 'wYztjmC8K4k1niXZRoFxUOkHvc4IZUEr1yiC0meMim0',
    description: 'PKCE: code verifier',
  })
  @IsOptional()
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.codeVerifier' }) })
  @MinLength(43, { message: i18n('validation.MinLength', { path: 'app', property: 'auth.codeVerifier', min: 43 }) })
  codeVerifier?: string;

  @ApiPropertyOptional({ example: 'https://auth.expo.io/@user/PIGEON-APP', description: 'PKCE: redirect URI' })
  @IsOptional()
  @IsString({ message: i18n('validation.IsString', { path: 'app', property: 'auth.redirectUri' }) })
  @IsUrl({}, { message: i18n('validation.IsUrl', { path: 'app', property: 'auth.redirectUri' }) })
  redirectUri?: string;
}
