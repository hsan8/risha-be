import { ObjectValues } from '@/core/types';

export const AuthProvider = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  APPLE: 'APPLE',
} as const;

export type AuthProvider = ObjectValues<typeof AuthProvider>;

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
} as const;

export type UserStatus = ObjectValues<typeof UserStatus>;

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
} as const;

export type UserRole = ObjectValues<typeof UserRole>;

export const OTPType = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
  TWO_FACTOR_AUTH: 'TWO_FACTOR_AUTH',
} as const;

export type OTPType = ObjectValues<typeof OTPType>;

export const TokenType = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
  RESET_PASSWORD: 'RESET_PASSWORD',
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
} as const;

export type TokenType = ObjectValues<typeof TokenType>;
