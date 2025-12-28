export const AUTH_CONSTANTS = {
  // Collections
  USERS_COLLECTION: 'users',
  OTP_COLLECTION: 'otps',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
  JWT_ACCESS_TOKEN_EXPIRY: '2y',
  JWT_REFRESH_TOKEN_EXPIRY: '2y',
  JWT_RESET_PASSWORD_TOKEN_EXPIRY: '1h',
  JWT_EMAIL_VERIFICATION_TOKEN_EXPIRY: '2y',

  // OTP
  OTP_LENGTH: 5,
  OTP_EXPIRY_MINUTES: 10,
  MAX_OTP_ATTEMPTS: 5,
  OTP_RESEND_COOLDOWN_MINUTES: 3,
  MAX_OTP_PER_DAY: 10,

  // Password
  SALT_ROUNDS: 12,
  MIN_PASSWORD_LENGTH: 5,
  MAX_PASSWORD_LENGTH: 5,

  // Social Auth
  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID || '971298286559-nf2n2mnmevijcf2ib4p5rligfk6hk12f.apps.googleusercontent.com',
  GOOGLE_CLIENT_IDS: [
    process.env.GOOGLE_CLIENT_ID,
    '885034111440-fopbpctktaiiii7qp08ucoshe5l718vu.apps.googleusercontent.com', // New Web Client ID (also used for Expo Go)
    '885034111440-pk55t90q87vaqgrf30jmgvvf3rm99rt5.apps.googleusercontent.com', // New Android Client ID
    '885034111440-tkn165f617h9m2stkh5843ra19q9rc8n.apps.googleusercontent.com', // New iOS Client ID
    process.env.GOOGLE_IOS_CLIENT_ID,
    '971298286559-nf2n2mnmevijcf2ib4p5rligfk6hk12f.apps.googleusercontent.com', // Old Android (for compatibility during transition)
    '971298286559-5etslvog7t5bf22dmecqg51q6j1krqif.apps.googleusercontent.com', // Old Web (for compatibility during transition)
  ].filter(Boolean),
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
  YEARS_COUNT: 2,
  DAYS_IN_YEAR: 365,
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
  SECONDS_IN_MINUTE: 60,

  // OTP generation constants
  OTP_MIN_VALUE: 10000,
  OTP_MAX_VALUE: 90000,

  // Time constants
  MINUTES_TO_SECONDS: 60,
  SECONDS_TO_MILLISECONDS: 1000,
  HOURS_PER_DAY: 24,

  // Validation
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
} as const;

// Computed constants that use the base constants
export const LOGIN_ATTEMPTS_WINDOW =
  AUTH_CONSTANTS.LOGIN_ATTEMPTS_WINDOW_MINUTES *
  AUTH_CONSTANTS.LOGIN_ATTEMPTS_WINDOW_SECONDS *
  AUTH_CONSTANTS.LOGIN_ATTEMPTS_WINDOW_MILLISECONDS;

// Token expiry computed constants
export const TOKEN_EXPIRY_MINUTES =
  AUTH_CONSTANTS.YEARS_COUNT *
  AUTH_CONSTANTS.DAYS_IN_YEAR *
  AUTH_CONSTANTS.HOURS_IN_DAY *
  AUTH_CONSTANTS.MINUTES_IN_HOUR;

export const TOKEN_EXPIRY_SECONDS =
  AUTH_CONSTANTS.YEARS_COUNT *
  AUTH_CONSTANTS.DAYS_IN_YEAR *
  AUTH_CONSTANTS.HOURS_IN_DAY *
  AUTH_CONSTANTS.MINUTES_IN_HOUR *
  AUTH_CONSTANTS.SECONDS_IN_MINUTE;

export const MILLISECONDS_PER_MINUTE = AUTH_CONSTANTS.MINUTES_TO_SECONDS * AUTH_CONSTANTS.SECONDS_TO_MILLISECONDS;

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
  OTP_RESEND_COOLDOWN: 'Please wait 3 minutes before requesting another OTP',
  OTP_DAILY_LIMIT: 'Maximum OTP requests per day exceeded. Please try again tomorrow',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  INVALID_TOKEN: 'Invalid or expired token',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  WEAK_PASSWORD: 'Password must be at least 4 digits long',

  // Social Auth
  GOOGLE_AUTH_ERROR: 'Google authentication failed',
  APPLE_AUTH_ERROR: 'Apple authentication failed',
  SOCIAL_AUTH_EMAIL_REQUIRED: 'Email is required for social authentication',

  // Auth Guard
  TOKEN_REQUIRED: 'Authentication token is required',
  USER_NOT_FOUND: 'User not found',
} as const;
