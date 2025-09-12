export const VALIDATION_CONSTANTS = {
  // Server defaults
  DEFAULT_PORT: 3000,

  // Common validation lengths
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,

  // Documentation number validation
  MIN_DOCUMENTATION_LENGTH: 8,
  MAX_DOCUMENTATION_LENGTH: 20,

  // Ring validation
  MIN_RING_LENGTH: 2,
  MAX_RING_LENGTH: 20,

  // Case validation
  MIN_CASE_LENGTH: 5,
  MAX_CASE_LENGTH: 20,

  // Parent name validation
  MIN_PARENT_NAME_LENGTH: 2,
  MAX_PARENT_NAME_LENGTH: 100,

  // Year validation
  YEAR_LENGTH: 4,

  // Registration number
  SEQUENCE_PADDING: 3,

  // Auth validation constants
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  OTP_LENGTH: 5,
} as const;
