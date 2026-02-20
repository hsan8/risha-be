import { AUTH_MESSAGES_I18N } from '@/auth/constants';
import { UserStatus } from '@/auth/enums';
import { DEFAULT_LOCALE } from '@/core/enums';
import { UserService } from '@/user/services';
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  status: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(AUTH_MESSAGES_I18N.TOKEN_REQUIRED[DEFAULT_LOCALE]);
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      // const user = await this.userService.findById(payload.sub);
      // if (!user) {
      //   throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
      // }

      if (payload.status === UserStatus.SUSPENDED) {
        throw new UnauthorizedException(AUTH_MESSAGES_I18N.ACCOUNT_SUSPENDED[DEFAULT_LOCALE]);
      }

      if (payload.status === UserStatus.INACTIVE) {
        throw new UnauthorizedException(AUTH_MESSAGES_I18N.ACCOUNT_INACTIVE[DEFAULT_LOCALE]);
      }

      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        status: payload.status,
      };

      return true;
    } catch (error) {
      this.logger.warn(`JWT verification failed: ${error.message}`);
      throw new UnauthorizedException(AUTH_MESSAGES_I18N.INVALID_TOKEN[DEFAULT_LOCALE]);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
