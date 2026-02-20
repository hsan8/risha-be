import { UserLocale } from '@/core/enums';

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

  // Social Auth - OAuth 2.0 Client IDs for com.anonymous.pigeonapp
  GOOGLE_CLIENT_ID: '885034111440-fopbpctktaiiii7qp08ucoshe5l718vu.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: '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',
  GOOGLE_CLIENT_IDS: [
    process.env.GOOGLE_CLIENT_ID,
    '885034111440-fopbpctktaiiii7qp08ucoshe5l718vu.apps.googleusercontent.com', // Web client (Expo Go, auth.expo.io)
    '885034111440-3n9brjg623vfo65g2i99lidnombp568r.apps.googleusercontent.com', // Android (com.anonymous.pigeonapp, auto created)
    '885034111440-pk55t90q87vaqgrf30jmgvvf3rm99rt5.apps.googleusercontent.com', // Android (com.anonymous.pigeonapp)
    '885034111440-tkn165f617h9m2stkh5843ra19q9rc8n.apps.googleusercontent.com', // iOS (com.anonymous.PIGEONAPP)
    process.env.GOOGLE_IOS_CLIENT_ID,
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

export const AUTH_MESSAGES_I18N: Record<string, Record<UserLocale, string>> = {
  // Success
  REGISTRATION_SUCCESS: {
    [UserLocale.ENGLISH]: 'Registration successful',
    [UserLocale.ARABIC]: 'تم التسجيل بنجاح',
  },
  LOGIN_SUCCESS: {
    [UserLocale.ENGLISH]: 'Login successful',
    [UserLocale.ARABIC]: 'تم تسجيل الدخول بنجاح',
  },
  LOGOUT_SUCCESS: {
    [UserLocale.ENGLISH]: 'Logout successful',
    [UserLocale.ARABIC]: 'تم تسجيل الخروج بنجاح',
  },
  PASSWORD_RESET_SUCCESS: {
    [UserLocale.ENGLISH]: 'Password reset successful',
    [UserLocale.ARABIC]: 'تم إعادة تعيين كلمة المرور بنجاح',
  },
  OTP_SENT: {
    [UserLocale.ENGLISH]: 'OTP sent successfully',
    [UserLocale.ARABIC]: 'تم إرسال رمز التحقق بنجاح',
  },
  OTP_VERIFIED: {
    [UserLocale.ENGLISH]: 'OTP verified successfully',
    [UserLocale.ARABIC]: 'تم التحقق من الرمز بنجاح',
  },
  EMAIL_VERIFIED: {
    [UserLocale.ENGLISH]: 'Email verified successfully',
    [UserLocale.ARABIC]: 'تم التحقق من البريد الإلكتروني بنجاح',
  },

  // Errors
  INVALID_CREDENTIALS: {
    [UserLocale.ENGLISH]: 'Invalid email or password',
    [UserLocale.ARABIC]: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },
  ACCOUNT_SUSPENDED: {
    [UserLocale.ENGLISH]: 'Account has been suspended',
    [UserLocale.ARABIC]: 'تم تعليق الحساب',
  },
  ACCOUNT_INACTIVE: {
    [UserLocale.ENGLISH]: 'Account is inactive',
    [UserLocale.ARABIC]: 'الحساب غير نشط',
  },
  EMAIL_ALREADY_EXISTS: {
    [UserLocale.ENGLISH]: 'Email already exists',
    [UserLocale.ARABIC]: 'البريد الإلكتروني مستخدم بالفعل',
  },
  EMAIL_NOT_FOUND: {
    [UserLocale.ENGLISH]: 'Email not found',
    [UserLocale.ARABIC]: 'البريد الإلكتروني غير موجود',
  },
  INVALID_OTP: {
    [UserLocale.ENGLISH]: 'Invalid or expired OTP',
    [UserLocale.ARABIC]: 'رمز التحقق غير صحيح أو منتهي الصلاحية',
  },
  OTP_EXPIRED: {
    [UserLocale.ENGLISH]: 'OTP has expired',
    [UserLocale.ARABIC]: 'انتهت صلاحية رمز التحقق',
  },
  OTP_ALREADY_USED: {
    [UserLocale.ENGLISH]: 'OTP has already been used',
    [UserLocale.ARABIC]: 'تم استخدام رمز التحقق مسبقاً',
  },
  MAX_OTP_ATTEMPTS: {
    [UserLocale.ENGLISH]: 'Maximum OTP attempts exceeded',
    [UserLocale.ARABIC]: 'تم تجاوز الحد الأقصى لمحاولات التحقق',
  },
  OTP_RESEND_COOLDOWN: {
    [UserLocale.ENGLISH]: 'Please wait 3 minutes before requesting another OTP',
    [UserLocale.ARABIC]: 'يرجى الانتظار 3 دقائق قبل طلب رمز تحقق جديد',
  },
  OTP_DAILY_LIMIT: {
    [UserLocale.ENGLISH]: 'Maximum OTP requests per day exceeded. Please try again tomorrow',
    [UserLocale.ARABIC]: 'تم تجاوز الحد اليومي لطلبات رمز التحقق. يرجى المحاولة غداً',
  },
  EMAIL_NOT_VERIFIED: {
    [UserLocale.ENGLISH]: 'Email not verified',
    [UserLocale.ARABIC]: 'البريد الإلكتروني غير موثق',
  },
  INVALID_TOKEN: {
    [UserLocale.ENGLISH]: 'Invalid or expired token',
    [UserLocale.ARABIC]: 'الرمز غير صحيح أو منتهي الصلاحية',
  },
  PASSWORDS_DO_NOT_MATCH: {
    [UserLocale.ENGLISH]: 'Passwords do not match',
    [UserLocale.ARABIC]: 'كلمات المرور غير متطابقة',
  },
  WEAK_PASSWORD: {
    [UserLocale.ENGLISH]: 'Password must be at least 4 digits long',
    [UserLocale.ARABIC]: 'كلمة المرور يجب أن تكون 4 أرقام على الأقل',
  },

  // Social Auth
  GOOGLE_AUTH_ERROR: {
    [UserLocale.ENGLISH]: 'Google authentication failed',
    [UserLocale.ARABIC]: 'فشل تسجيل الدخول عبر Google',
  },
  APPLE_AUTH_ERROR: {
    [UserLocale.ENGLISH]: 'Apple authentication failed',
    [UserLocale.ARABIC]: 'فشل تسجيل الدخول عبر Apple',
  },
  SOCIAL_AUTH_EMAIL_REQUIRED: {
    [UserLocale.ENGLISH]: 'Email is required for social authentication',
    [UserLocale.ARABIC]: 'البريد الإلكتروني مطلوب لتسجيل الدخول الاجتماعي',
  },

  // Auth Guard
  TOKEN_REQUIRED: {
    [UserLocale.ENGLISH]: 'Authentication token is required',
    [UserLocale.ARABIC]: 'رمز المصادقة مطلوب',
  },
  USER_NOT_FOUND: {
    [UserLocale.ENGLISH]: 'User not found',
    [UserLocale.ARABIC]: 'المستخدم غير موجود',
  },
} as const;
