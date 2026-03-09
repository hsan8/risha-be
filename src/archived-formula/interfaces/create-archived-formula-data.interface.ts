import { Formula } from '@/formula/entities';

export interface ICreateArchivedFormulaData {
  originalFormulaId: string;
  userId: string;
  archiveReason: string;
  formulaSnapshot: Formula;
}
