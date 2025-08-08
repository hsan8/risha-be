import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestUser } from './user.decorator';

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const BASE64_PADDING_DIVISOR = 4;
  const padLength = BASE64_PADDING_DIVISOR - (normalized.length % BASE64_PADDING_DIVISOR);
  const padded = padLength === BASE64_PADDING_DIVISOR ? normalized : normalized + '='.repeat(padLength);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function decodeJwtPayload(token: string): Partial<RequestUser> | null {
  try {
    const parts = token.split('.');
    const JWT_PARTS_COUNT = 3;
    if (parts.length !== JWT_PARTS_COUNT) {
      return null;
    }

    const JWT_PAYLOAD_INDEX = 1;
    const payloadJson = base64UrlDecode(parts[JWT_PAYLOAD_INDEX]);
    const payload = JSON.parse(payloadJson) as {
      sub?: string;
      email?: string;
      role?: string;
      status?: string;
    };

    if (!payload) {
      return null;
    }

    return {
      id: payload.sub ?? '',
      email: payload.email ?? '',
      role: payload.role ?? '',
      status: payload.status ?? '',
    };
  } catch {
    return null;
  }
}

export const TokenUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext): RequestUser | string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const requestUser = request.user as RequestUser | undefined;
    if (requestUser) {
      return data ? requestUser[data] : requestUser;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }

    const token = authHeader.slice('Bearer '.length);
    const decoded = decodeJwtPayload(token);
    if (!decoded) {
      return undefined;
    }

    const user: RequestUser = {
      id: decoded.id ?? '',
      email: decoded.email ?? '',
      role: decoded.role ?? '',
      status: decoded.status ?? '',
    };

    return data ? user[data] : user;
  },
);
