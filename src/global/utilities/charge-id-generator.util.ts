import { UniqueNumber } from 'unique-string-generator';
const CHARGE_ID_SUFFIX_LENGTH = 19;

export function generateChargeId(): string {
  return `${UniqueNumber(CHARGE_ID_SUFFIX_LENGTH)}`;
}
