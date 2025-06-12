import { UniqueNumber } from 'unique-string-generator';
import { ProductionMode } from '../enums/mode.enums';
const TRANSACTION_ID_SUFFIX_LENGTH = 10;

export function generateTransactionId(mode: ProductionMode): string {
  const prefix = mode === ProductionMode.LIVE ? 'liv' : 'tst';
  return `${UniqueNumber(TRANSACTION_ID_SUFFIX_LENGTH) + prefix}`;
}
