import { IsString, IsOptional, IsDate, IsEnum, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FormulaStatus, FormulaActions } from '../enums';

export class Parent {
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @IsString()
  name: string;
}

export class Egg {
  @IsUUID('4')
  id: string;

  @IsDate()
  deliveredAt: Date;

  @IsDate()
  transformedToPigeonAt?: Date;

  @IsOptional()
  @IsUUID('4')
  pigeonId?: string;
}

export class FormulaHistory {
  @IsEnum(FormulaActions)
  action: FormulaActions;

  @IsString()
  description: string;

  @IsDate()
  date: Date;
}

export class Formula {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => Parent)
  father: Parent;

  @ValidateNested()
  @Type(() => Parent)
  mother: Parent;

  @IsOptional()
  @IsString()
  caseNumber?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Egg)
  eggs: Egg[];

  @IsArray()
  @IsUUID('4', { each: true })
  children: string[];

  @IsEnum(FormulaStatus)
  status: FormulaStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormulaHistory)
  history: FormulaHistory[];

  @IsString()
  yearOfFormula: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
