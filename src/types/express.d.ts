import { User } from '@/user/entities';

declare global {
  namespace Express {
    interface Request {
      /** Set by JwtAuthGuard: full user entity when JWT is valid */
      user?: User;
    }
  }
}
