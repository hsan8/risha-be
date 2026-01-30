import { AuthProvider } from '@/auth/enums';

export interface ICreateUserParams {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  avatar?: string;
  passwordHash?: string;
  provider: AuthProvider;
  providerId?: string;
}
