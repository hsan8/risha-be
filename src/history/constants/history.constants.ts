import { UserLocale } from '@/core/enums';

export const HISTORY_CONSTANTS = {
  COLLECTION_NAME: 'pigeon-history',
} as const;

export const HISTORY_EVENT_LABELS_I18N: Record<string, Record<UserLocale, string>> = {
  COMBINATION_CREATED: {
    [UserLocale.ARABIC]: 'تم انشاء التركيبة بتاريخ :',
    [UserLocale.ENGLISH]: 'Combination created on:',
  },
  EGG_LAID: {
    [UserLocale.ARABIC]: 'تم وضع البيض بتاريخ:',
    [UserLocale.ENGLISH]: 'Egg laid on:',
  },
  TRANSFERRED_TO_INCUBATOR: {
    [UserLocale.ARABIC]: 'تم تحويل البيضة الى فرخ بتاريخ:',
    [UserLocale.ENGLISH]: 'Transferred to incubator on:',
  },
  CHICK_VACCINATED: {
    [UserLocale.ARABIC]: 'تم تطعيم الفرخ بتاريخ:',
    [UserLocale.ENGLISH]: 'Chick vaccinated on:',
  },
  CHICK_RECORDED: {
    [UserLocale.ARABIC]: 'تم تسجيل الفرخ بتاريخ :',
    [UserLocale.ENGLISH]: 'Chick recorded on:',
  },
  DEATH: {
    [UserLocale.ARABIC]: 'تم الوفاة بتاريخ:',
    [UserLocale.ENGLISH]: 'Death on:',
  },
  PIGEON_CREATED_MANUALLY: {
    [UserLocale.ARABIC]: 'تم تسجيل الحمامة بتاريخ:',
    [UserLocale.ENGLISH]: 'Pigeon recorded on:',
  },
  FORMULA_CREATED: {
    [UserLocale.ARABIC]: 'تم انشاء التركيبة بتاريخ:',
    [UserLocale.ENGLISH]: 'Formula created on:',
  },
  FORMULA_TERMINATED: {
    [UserLocale.ARABIC]: 'تم إنهاء التركيبة بتاريخ:',
    [UserLocale.ENGLISH]: 'Formula terminated on:',
  },
  FIRST_EGG_DELIVERED: {
    [UserLocale.ARABIC]: 'تم وضع البيضة الأولى بتاريخ:',
    [UserLocale.ENGLISH]: 'First egg delivered on:',
  },
  SECOND_EGG_DELIVERED: {
    [UserLocale.ARABIC]: 'تم وضع البيضة الثانية بتاريخ:',
    [UserLocale.ENGLISH]: 'Second egg delivered on:',
  },
  FIRST_EGG_TRANSFORMED_TO_FRESH_PIGEON: {
    [UserLocale.ARABIC]: 'تحويل البيضة الأولى الى فرخ بتاريخ:',
    [UserLocale.ENGLISH]: 'First egg transformed to chick on:',
  },
  SECOND_EGG_TRANSFORMED_TO_FRESH_PIGEON: {
    [UserLocale.ARABIC]: 'تحويل البيضة الثانية الى فرخ بتاريخ:',
    [UserLocale.ENGLISH]: 'Second egg transformed to chick on:',
  },
  PIGEON_VACCINATED: {
    [UserLocale.ARABIC]: 'تم التطعيم بتاريخ:',
    [UserLocale.ENGLISH]: 'Vaccinated on:',
  },
  PIGEON_DIED: {
    [UserLocale.ARABIC]: 'تسجيل الوفاة بتاريخ:',
    [UserLocale.ENGLISH]: 'Death recorded on:',
  },
  PIGEON_SOLD: {
    [UserLocale.ARABIC]: 'تسجيل البيع او الاهداء بتاريخ:',
    [UserLocale.ENGLISH]: 'Sale/Gift recorded on:',
  },
  PIGEON_TRANSFERRED_TO_OTHER_FARM: {
    [UserLocale.ARABIC]: 'تسجيل النقل بتاريخ:',
    [UserLocale.ENGLISH]: 'Transfer recorded on:',
  },
};
