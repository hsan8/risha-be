import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface RequestUser {
  id: string;
  email: string;
  role: string;
  status: string;
}

export const User = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext): RequestUser | string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as RequestUser;
    return data ? user[data] : user;
  },
);

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return (request.user as RequestUser)?.id;
});
