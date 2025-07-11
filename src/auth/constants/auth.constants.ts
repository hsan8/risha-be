export const AUTH_CONSTANTS = {
  // Collections
  USERS_COLLECTION: 'users',
  OTP_COLLECTION: 'otps',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
  JWT_ACCESS_TOKEN_EXPIRY: '15m',
  JWT_REFRESH_TOKEN_EXPIRY: '7d',
  JWT_RESET_PASSWORD_TOKEN_EXPIRY: '1h',
  JWT_EMAIL_VERIFICATION_TOKEN_EXPIRY: '24h',

  // OTP
  OTP_LENGTH: 5,
  OTP_EXPIRY_MINUTES: 10,
  MAX_OTP_ATTEMPTS: 5,

  // Password
  SALT_ROUNDS: 12,
  MIN_PASSWORD_LENGTH: 4,
  MAX_PASSWORD_LENGTH: 20,

  // Social Auth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,

  // Email
  EMAIL_FROM: process.env.EMAIL_FROM || 'rishaapp28@gmail.com',
  EMAIL_SENDER_NAME: process.env.EMAIL_SENDER_NAME || 'Risha App Team',

  // Rate Limiting
  LOGIN_ATTEMPTS_LIMIT: 5,
  LOGIN_ATTEMPTS_WINDOW_MINUTES: 15,
  LOGIN_ATTEMPTS_WINDOW_SECONDS: 60,
  LOGIN_ATTEMPTS_WINDOW_MILLISECONDS: 1000,

  // Token expiry constants
  TOKEN_EXPIRY_MINUTES: 15,
  TOKEN_EXPIRY_SECONDS: 60,

  // OTP generation constants
  OTP_MIN_VALUE: 10000,
  OTP_MAX_VALUE: 90000,

  // Time constants
  MINUTES_TO_SECONDS: 60,
  SECONDS_TO_MILLISECONDS: 1000,

  // Validation
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
} as const;

// Computed constants that use the base constants
export const LOGIN_ATTEMPTS_WINDOW =
  AUTH_CONSTANTS.LOGIN_ATTEMPTS_WINDOW_MINUTES *
  AUTH_CONSTANTS.LOGIN_ATTEMPTS_WINDOW_SECONDS *
  AUTH_CONSTANTS.LOGIN_ATTEMPTS_WINDOW_MILLISECONDS;

export const AUTH_MESSAGES = {
  // Success
  REGISTRATION_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFIED: 'OTP verified successfully',
  EMAIL_VERIFIED: 'Email verified successfully',

  // Errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_SUSPENDED: 'Account has been suspended',
  ACCOUNT_INACTIVE: 'Account is inactive',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_NOT_FOUND: 'Email not found',
  INVALID_OTP: 'Invalid or expired OTP',
  OTP_EXPIRED: 'OTP has expired',
  OTP_ALREADY_USED: 'OTP has already been used',
  MAX_OTP_ATTEMPTS: 'Maximum OTP attempts exceeded',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  INVALID_TOKEN: 'Invalid or expired token',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  WEAK_PASSWORD: 'Password must be at least 4 digits long',

  // Social Auth
  GOOGLE_AUTH_ERROR: 'Google authentication failed',
  APPLE_AUTH_ERROR: 'Apple authentication failed',
  SOCIAL_AUTH_EMAIL_REQUIRED: 'Email is required for social authentication',
} as const;
