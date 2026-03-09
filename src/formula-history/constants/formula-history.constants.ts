import { UserLocale } from '@/core/enums';

export const FORMULA_HISTORY_CONSTANTS = {
  COLLECTION_NAME: 'formula-history',
} as const;

export const FORMULA_ACTION_LABELS_I18N: Record<
  string,
  Record<UserLocale, string | ((previousBoxNumber: string, newBoxNumber: string) => string)>
> = {
  FORMULA_INITIATED: {
    [UserLocale.ARABIC]: 'تم انشاء التركيبة بتاريخ:',
    [UserLocale.ENGLISH]: 'Formula initiated on:',
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
  FORMULA_GOT_TERMINATED: {
    [UserLocale.ARABIC]: 'تم إنهاء التركيبة بتاريخ:',
    [UserLocale.ENGLISH]: 'Formula terminated on:',
  },
  EGGS_DESTROYED: {
    [UserLocale.ARABIC]: 'تم إتلاف البيض/البيضة بتاريخ:',
    [UserLocale.ENGLISH]: 'Egg(s) destroyed on:',
  },
  BOX_NUMBER_UPDATED: {
    [UserLocale.ARABIC]: (previousBoxNumber: string, newBoxNumber: string): string =>
      ` نقل البيض من خانة "${previousBoxNumber}" إلى خانة "${newBoxNumber}" بتاريخ:`,
    [UserLocale.ENGLISH]: (previousBoxNumber: string, newBoxNumber: string): string =>
      `Eggs transferred from box "${previousBoxNumber}" to box "${newBoxNumber}" on:`,
  },
};
