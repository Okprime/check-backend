import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

export type AuthUserData = User;

export interface RequestWithUser extends Request {
  user: User;
}

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user
      ? {
          id: request.user.id,
          firstName: request.user.firstName,
          lastName: request.user.lastName,
          email: request.user.email,
          role: request.user.role,
          phoneNumber: request.user.phoneNumber,
          createdAt: request.user.createdAt,
          updatedAt: request.user.updatedAt,
          deviceToken: request.user.deviceToken,
          balance: request.user.balance,
        }
      : null;
  },
);
