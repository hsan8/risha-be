import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { FormulaStatus } from '../enums';

export class Parent {
  @IsOptional()
  @IsString()
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
  @IsString()
  pigeonId?: string;
}

export class Formula {
  @IsUUID('4')
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
  @IsString({ each: true })
  children: string[];

  @IsEnum(FormulaStatus)
  status: FormulaStatus;

  @IsString()
  yearOfFormula: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
