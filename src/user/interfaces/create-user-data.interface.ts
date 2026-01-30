import { AuthProvider, UserRole, UserStatus } from '@/auth/enums';

export interface ICreateUserData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  avatar?: string;
  passwordHash?: string;
  provider: AuthProvider;
  providerId?: string;
  status: UserStatus;
  role: UserRole;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}
