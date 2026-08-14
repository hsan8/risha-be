import { FormulaSnapshot } from '../entities/formula-snapshot.entity';

export interface ICreateArchivedFormulaData {
  originalFormulaId: string;
  userId: string;
  archiveReason: string;
  formulaSnapshot: FormulaSnapshot;
}
