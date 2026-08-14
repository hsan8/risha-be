import { Egg } from '@/formula/entities';
import { FormulaStatus } from '@/formula/enums';
import { PigeonSnapshot } from './pigeon-snapshot.entity';

export class FormulaSnapshot {
  id: string;
  father: PigeonSnapshot;
  mother: PigeonSnapshot;
  boxNumber?: string;
  eggs: Egg[];
  children: PigeonSnapshot[];
  status: FormulaStatus;
  yearOfFormula: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
