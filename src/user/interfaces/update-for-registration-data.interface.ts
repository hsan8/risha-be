import { AuthProvider, UserStatus } from '@/auth/enums';

export interface IUpdateForRegistrationData {
  name?: string;
  phone?: string;
  country?: string;
  passwordHash?: string;
  provider?: AuthProvider;
  status?: UserStatus;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
}
