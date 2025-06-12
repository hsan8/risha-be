export const AuthUserProfileType = {
  MERCHANT_OWNER: 'MERCHANT_OWNER',
  MERCHANT_USER: 'MERCHANT_USER',
} as const;

export type AuthUserProfileType = (typeof AuthUserProfileType)[keyof typeof AuthUserProfileType];
