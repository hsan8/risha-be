export const Order = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type Order = keyof typeof Order;
