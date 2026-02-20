import { AUTH_MESSAGES_I18N } from '@/auth/constants';
import { UserLocale } from '@/core/enums';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

export interface AppleUserInfo {
  id: string;
  email?: string;
  name?: string;
}

@Injectable()
export class AppleAuthService {
  private readonly logger = new Logger(AppleAuthService.name);

  verifyIdToken(_idToken: string, locale: UserLocale): Promise<AppleUserInfo> {
    // Apple ID token verification logic here
    this.logger.error('Apple ID token verification not implemented');
    return Promise.reject(new UnauthorizedException(AUTH_MESSAGES_I18N.APPLE_AUTH_ERROR[locale]));
  }

  revokeToken(_refreshToken: string, locale: UserLocale): Promise<void> {
    // Apple token revocation logic here
    this.logger.error('Apple token revocation not implemented');
    return Promise.reject(new UnauthorizedException(AUTH_MESSAGES_I18N.APPLE_AUTH_ERROR[locale]));
  }
}
