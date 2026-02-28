import { UserLocale } from '@/core/enums';

export const PIGEON_CONSTANTS = {
  COLLECTION_NAME: 'pigeons',
  MAX_NAME_LENGTH: 100,
  MAX_FATHER_NAME_LENGTH: 100,
  MAX_MOTHER_NAME_LENGTH: 100,
  MAX_RING_NO_LENGTH: 20,
  MAX_RING_COLOR_LENGTH: 30,
  MAX_CASE_NUMBER_LENGTH: 50,
  MAX_OWNER_ID_LENGTH: 100,
  /** Year of registration format: e.g. 2026-2025 */
  YEAR_OF_REGISTRATION_PATTERN: /^\d{4}-\d{4}$/,
  RING_NO_PATTERN: /^[A-Z0-9]+$/,
} as const;

export const PIGEON_MESSAGES_I18N: Record<string, Record<UserLocale, string>> = {
  CREATED: {
    [UserLocale.ENGLISH]: 'Pigeon created successfully',
    [UserLocale.ARABIC]: 'تم إنشاء الحمامة بنجاح',
  },
  UPDATED: {
    [UserLocale.ENGLISH]: 'Pigeon updated successfully',
    [UserLocale.ARABIC]: 'تم تحديث الحمامة بنجاح',
  },
  DELETED: {
    [UserLocale.ENGLISH]: 'Pigeon deleted successfully',
    [UserLocale.ARABIC]: 'تم حذف الحمامة بنجاح',
  },
  NOT_FOUND: {
    [UserLocale.ENGLISH]: 'Pigeon not found',
    [UserLocale.ARABIC]: 'الحمامة غير موجودة',
  },
  ALREADY_EXISTS: {
    [UserLocale.ENGLISH]: 'Pigeon already exists',
    [UserLocale.ARABIC]: 'الحمامة موجودة بالفعل',
  },
  INVALID_PARENT: {
    [UserLocale.ENGLISH]: 'Invalid parent pigeon',
    [UserLocale.ARABIC]: 'الحمامة الأب/الأم غير صالحة',
  },
  INVALID_STATUS_TRANSITION: {
    [UserLocale.ENGLISH]: 'Invalid status transition',
    [UserLocale.ARABIC]: 'تغيير الحالة غير صالح',
  },
  INVALID_DOCUMENTATION_NUMBER: {
    [UserLocale.ENGLISH]: 'Invalid documentation number format',
    [UserLocale.ARABIC]: 'صيغة رقم التوثيق غير صالحة',
  },
  INVALID_YEAR_OF_BIRTH: {
    [UserLocale.ENGLISH]: 'Invalid year of birth format',
    [UserLocale.ARABIC]: 'صيغة سنة الميلاد غير صالحة',
  },
  PARENT_NOT_ALIVE: {
    [UserLocale.ENGLISH]: 'Parent pigeon is not alive',
    [UserLocale.ARABIC]: 'الحمامة الأب/الأم غير حية',
  },
  PARENT_WRONG_GENDER: {
    [UserLocale.ENGLISH]: 'Parent pigeon has wrong gender',
    [UserLocale.ARABIC]: 'جنس الحمامة الأب/الأم غير صحيح',
  },
  DEAD_PIGEON_CANNOT_CHANGE_STATUS: {
    [UserLocale.ENGLISH]: 'Dead pigeon cannot change status',
    [UserLocale.ARABIC]: 'لا يمكن تغيير حالة الحمامة الميتة',
  },
  SOLD_PIGEON_CANNOT_BE_ALIVE: {
    [UserLocale.ENGLISH]: 'Sold pigeon cannot be changed to alive',
    [UserLocale.ARABIC]: 'لا يمكن تغيير حالة الحمامة المباعة إلى حية',
  },
  DEAD_AT_REQUIRED: {
    [UserLocale.ENGLISH]: 'Dead date is required when changing status to DEAD',
    [UserLocale.ARABIC]: 'تاريخ الوفاة مطلوب عند تغيير الحالة إلى ميتة',
  },
} as const;

export const DOCUMENTATION_NUMBER_CONSTANTS = {
  PATTERN: /^\d{4}-[A-Z]-\d{3}$/,
  LETTERS: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ],
  MAX_SEQUENCE: 999,
  SEQUENCE_PADDING: 3,
} as const;
