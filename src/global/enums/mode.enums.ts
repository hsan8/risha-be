export const ProductionMode = {
  TEST: 'TEST',
  LIVE: 'LIVE',
} as const;

export type ProductionMode = keyof typeof ProductionMode;
