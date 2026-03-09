import { FormulaActions } from '@/formula/enums';

export interface BoxNumberUpdateParams {
  previousBoxNumber: string;
  newBoxNumber: string;
}

export interface FormulaHistoryEvent {
  id: string;
  formulaId: string;
  userId: string;
  action: FormulaActions;
  description: string;
  date: Date;
  createdAt: Date;
  /** Set when action is BOX_NUMBER_UPDATED */
  params?: BoxNumberUpdateParams;
}
