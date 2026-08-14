import { AUTH_CONSTANTS, AUTH_MESSAGES_I18N } from '@/auth/constants';
import { UserLocale } from '@/core/enums';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export interface AppleUserInfo {
  sub: string;
  email?: string;
  name?: string;
}

const APPLE_JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));

const APPLE_AUDIENCES = [
  'host.exp.Exponent',       // Expo Go (development)
  'com.risha.pigeonapp', // iOS production bundle ID
  AUTH_CONSTANTS.APPLE_CLIENT_ID, // override via APPLE_CLIENT_ID env var
].filter(Boolean) as string[];

@Injectable()
export class AppleAuthService {
  private readonly logger = new Logger(AppleAuthService.name);

  async verifyIdToken(idToken: string, locale: UserLocale): Promise<AppleUserInfo> {
    for (const audience of APPLE_AUDIENCES) {
      try {
        const { payload } = await jwtVerify(idToken, APPLE_JWKS, {
          issuer: 'https://appleid.apple.com',
          audience,
        });

        this.logger.log(`Apple ID token verified for sub: ${payload.sub}`);

        return {
          sub: payload.sub as string,
          email: payload['email'] as string | undefined,
          name: payload['name'] as string | undefined,
        };
      } catch {
        this.logger.warn(`Apple ID token did not match audience: ${audience}, trying next...`);
        continue;
      }
    }

    this.logger.error('Apple ID token verification failed for all audiences');
    throw new UnauthorizedException(AUTH_MESSAGES_I18N.APPLE_AUTH_ERROR[locale]);
  }

  revokeToken(_refreshToken: string, locale: UserLocale): Promise<void> {
    this.logger.error('Apple token revocation not implemented');
    return Promise.reject(new UnauthorizedException(AUTH_MESSAGES_I18N.APPLE_AUTH_ERROR[locale]));
  }
}
