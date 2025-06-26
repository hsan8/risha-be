import { FormulaActions, FormulaStatus } from '../enums/formula.enum';

export interface Parent {
  id?: string;
  name: string;
}

export interface Egg {
  id: string;
  deliveredAt: Date;
  transformedToPigeonAt?: Date;
  pigeonId?: string;
}

export interface FormulaHistory {
  action: FormulaActions;
  description: string;
  date: Date;
}

export interface Formula {
  id: string;
  father: Parent;
  mother: Parent;
  caseNumber?: string;
  eggs: Egg[];
  children: string[]; // Array of pigeon IDs
  status: FormulaStatus;
  history: FormulaHistory[];
  yearOfFormula: string;
  createdAt: Date;
  updatedAt: Date;
}
