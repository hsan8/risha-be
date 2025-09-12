import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AUTH_CONSTANTS } from '../constants';

export interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(AUTH_CONSTANTS.GOOGLE_CLIENT_ID);
  }

  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: AUTH_CONSTANTS.GOOGLE_CLIENT_IDS,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google ID token');
      }

      if (!payload.email || !payload.email_verified) {
        throw new UnauthorizedException('Google account email not verified');
      }

      const googleUser: GoogleUserInfo = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || '',
        picture: payload.picture,
        email_verified: payload.email_verified,
      };

      this.logger.log(`Google ID token verified for user: ${googleUser.email}`);
      return googleUser;
    } catch (error) {
      this.logger.error(`Google ID token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      this.client.setCredentials({ access_token: accessToken });

      const userInfoClient = new OAuth2Client();
      const userInfo = await userInfoClient.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = userInfo.data as any;

      if (!data.email || !data.verified_email) {
        throw new UnauthorizedException('Google account email not verified');
      }

      const googleUser: GoogleUserInfo = {
        sub: data.id,
        email: data.email,
        name: data.name || '',
        picture: data.picture,
        email_verified: data.verified_email,
      };

      this.logger.log(`Google user info retrieved for: ${googleUser.email}`);
      return googleUser;
    } catch (error) {
      this.logger.error(`Google user info retrieval failed: ${error.message}`);
      throw new UnauthorizedException('Failed to retrieve Google user info');
    }
  }
}
