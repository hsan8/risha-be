import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { AUTH_CONSTANTS, AUTH_MESSAGES } from '../constants/auth.constants';
import { UserRole, UserStatus } from '../enums/auth.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  constructor(private readonly jwtService: NestJwtService) {}

  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: AUTH_CONSTANTS.JWT_ACCESS_TOKEN_EXPIRY,
      secret: AUTH_CONSTANTS.JWT_SECRET,
    });
  }

  generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: AUTH_CONSTANTS.JWT_REFRESH_TOKEN_EXPIRY,
      secret: AUTH_CONSTANTS.JWT_SECRET,
    });
  }

  generateResetPasswordToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: AUTH_CONSTANTS.JWT_RESET_PASSWORD_TOKEN_EXPIRY,
      secret: AUTH_CONSTANTS.JWT_SECRET,
    });
  }

  generateEmailVerificationToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: AUTH_CONSTANTS.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRY,
      secret: AUTH_CONSTANTS.JWT_SECRET,
    });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: AUTH_CONSTANTS.JWT_SECRET,
      });

      return payload as JwtPayload;
    } catch (error) {
      this.logger.error(`JWT verification failed:`, error);
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.verifyToken(refreshToken);

      // Generate new tokens
      const newAccessToken = await this.generateAccessToken({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        status: payload.status,
      });

      const newRefreshToken = await this.generateRefreshToken({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        status: payload.status,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.error(`Token refresh failed:`, error);
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
    }
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const BEARER_PREFIX_LENGTH = 7;
    return authHeader.substring(BEARER_PREFIX_LENGTH); // Remove 'Bearer ' prefix
  }

  getTokenExpiry(token: string): Date | null {
    try {
      const decoded = this.jwtService.decode(token) as JwtPayload;
      if (!decoded || !decoded.exp) {
        return null;
      }

      return new Date(decoded.exp * AUTH_CONSTANTS.SECONDS_TO_MILLISECONDS);
    } catch (error) {
      this.logger.error(`Failed to decode token:`, error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) {
      return true;
    }

    return expiry < new Date();
  }
}
