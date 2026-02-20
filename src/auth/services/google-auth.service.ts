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
    this.client = new OAuth2Client();
  }

  /**
   * Verify Google ID token using OAuth2Client.
   * Audience must match the client ID(s) of the app that accesses the backend.
   */
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

      // sub is unique per Google Account, suitable as primary key for account lookup
      const googleUser: GoogleUserInfo = {
        sub: payload['sub'],
        email: payload['email']!,
        name: payload['name'] || '',
        picture: payload['picture'],
        email_verified: payload['email_verified'] ?? false,
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

  /**
   * Exchange authorization code (from PKCE flow) for tokens and return user info.
   * Used when mobile/SPA sends { code, codeVerifier, redirectUri } instead of idToken.
   * Web client requires client_secret for server-side token exchange.
   */
  async exchangeCodeForUserInfo(code: string, codeVerifier: string, redirectUri: string): Promise<GoogleUserInfo> {
    const webClientId = AUTH_CONSTANTS.GOOGLE_CLIENT_ID;
    const clientSecret = AUTH_CONSTANTS.GOOGLE_CLIENT_SECRET;

    if (!clientSecret) {
      this.logger.error('GOOGLE_CLIENT_SECRET is required for code exchange. Set it in env vars.');
      throw new UnauthorizedException(
        'Server configuration error: GOOGLE_CLIENT_SECRET is required for Google Sign-In. Add it from Google Cloud Console → Credentials → Web client.',
      );
    }

    const oauth2Client = new OAuth2Client(webClientId, clientSecret);

    try {
      const { tokens } = await oauth2Client.getToken({
        code,
        codeVerifier,
        redirect_uri: redirectUri,
      });

      const idToken = tokens.id_token;
      const accessToken = tokens.access_token;

      if (idToken) {
        return this.verifyIdToken(idToken);
      }
      if (accessToken) {
        return this.getUserInfo(accessToken);
      }
      throw new UnauthorizedException('No id_token or access_token in token response');
    } catch (err: any) {
      const msg = err?.response?.data?.error_description || err?.message;
      this.logger.error(`Code exchange failed: ${msg}`);

      if (msg?.includes('client_secret')) {
        throw new UnauthorizedException(
          'Set GOOGLE_CLIENT_SECRET in env. Get it from Google Cloud Console → Credentials → Web client → Client secret.',
        );
      }
      if (err?.response?.data?.error === 'unauthorized_client') {
        throw new UnauthorizedException(
          'Add redirect URI to Google Cloud Console: Credentials → Web client → Authorized redirect URIs → https://auth.expo.io/@alirahmi/PIGEON-APP',
        );
      }
      throw new UnauthorizedException('Invalid or expired authorization code');
    }
  }
}
