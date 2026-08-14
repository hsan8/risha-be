import { UserRole } from '@/auth/enums';
import { FirebaseService } from '@/core/services';
import { IRequestUser } from '@/user/interfaces';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as IRequestUser | undefined;

    if (!user?.id) {
      throw new ForbiddenException();
    }

    const isAllowedByRole = user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR;
    if (isAllowedByRole) {
      return true;
    }

    const adminRef = this.firebaseService.getDatabase().ref('admin').child('users').child(user.id);
    const adminSnapshot = await adminRef.once('value');
    const adminRecord = adminSnapshot.val() as { status?: string } | null;

    if (adminRecord?.status === 'ACTIVE') {
      return true;
    }

    this.logger.warn(`Admin access denied for user ${user.id}`);
    throw new ForbiddenException('Admin access required');
  }
}
