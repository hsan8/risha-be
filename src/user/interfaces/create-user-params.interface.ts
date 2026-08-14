import { AuthProvider, UserStatus } from '@/auth/enums';

export interface ICreateUserParams {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  avatar?: string;
  passwordHash?: string;
  provider: AuthProvider;
  providerId?: string;
  /** Override email verification state. Defaults to false. */
  emailVerified?: boolean;
  /** Override initial status. Defaults to PENDING_VERIFICATION. */
  status?: UserStatus;
}
