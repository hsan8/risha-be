import { FormulaActions } from '@/formula/enums';

export interface FormulaHistoryEvent {
  id: string;
  formulaId: string;
  userId: string;
  action: FormulaActions;
  description: string;
  date: Date;
  createdAt: Date;
}
