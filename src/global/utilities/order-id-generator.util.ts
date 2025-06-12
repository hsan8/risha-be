import { UniqueNumber } from 'unique-string-generator';
const ORDER_ID_SUFFIX_LENGTH = 10;

export function generateOrderId(): string {
  return `${UniqueNumber(ORDER_ID_SUFFIX_LENGTH)}`;
}
