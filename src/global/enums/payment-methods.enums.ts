// Define the Products enum as a constant
export const PaymentMethods = {
  KNET: 'KNET',
  VISA: 'VISA',
  MASTER_CARD: 'MASTER_CARD',
  APPLE_PAY: 'APPLE_PAY',
  SAMSUNG_PAY: 'SAMSUNG_PAY',
  GOOGLE_PAY: 'GOOGLE_PAY',
} as const;

export type PaymentMethods = keyof typeof PaymentMethods;
