import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '@/user/services';
import { AUTH_MESSAGES } from '@/auth/constants';
import { UserStatus } from '@/auth/enums';

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
      throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_REQUIRED);
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      // Verify user still exists and is active
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
      }

      if (user.status === UserStatus.SUSPENDED) {
        throw new UnauthorizedException(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
      }

      if (user.status === UserStatus.INACTIVE) {
        throw new UnauthorizedException(AUTH_MESSAGES.ACCOUNT_INACTIVE);
      }

      // Attach user info to request
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        status: payload.status,
      };

      return true;
    } catch (error) {
      this.logger.warn(`JWT verification failed: ${error.message}`);
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
