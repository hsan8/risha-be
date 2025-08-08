import { RequestUser } from '@/user/decorators';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
