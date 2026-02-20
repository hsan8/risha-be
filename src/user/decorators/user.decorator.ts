import { IRequestUser } from '@/user/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: keyof IRequestUser | undefined, ctx: ExecutionContext): IRequestUser | string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as IRequestUser;
    return data ? user[data] : user;
  },
);

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return (request.user as IRequestUser)?.id;
});
