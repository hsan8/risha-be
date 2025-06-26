export const FORMULA_CONSTANTS = {
  COLLECTION_NAME: 'formulas',
  MAX_PARENT_NAME_LENGTH: 100,
  MAX_CASE_NUMBER_LENGTH: 50,
  YEAR_PATTERN: /^\d{4}$/,
} as const;

export const FORMULA_MESSAGES = {
  CREATED: 'Formula created successfully',
  UPDATED: 'Formula updated successfully',
  TERMINATED: 'Formula terminated successfully',
  NOT_FOUND: 'Formula not found',
  ALREADY_EXISTS: 'Formula already exists',
  INVALID_PARENT: 'Invalid parent',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
  INVALID_YEAR: 'Invalid year format',
  MAX_EGGS_REACHED: 'Formula already has maximum number of eggs (2)',
  EGG_NOT_FOUND: 'Egg not found in formula',
  INVALID_EGG_TRANSFORMATION: 'Invalid egg transformation - egg already transformed or not found',
} as const;
