import { FormulaStatus } from '../enums/formula.enum';

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

export interface Formula {
  id: string;
  father: Parent;
  mother: Parent;
  boxNumber?: string;
  eggs: Egg[];
  children: string[]; // Array of pigeon IDs
  status: FormulaStatus;
  yearOfFormula: string;
  createdAt: Date;
  updatedAt: Date;
}
