import { ApiProperty } from '@nestjs/swagger';
import { Child, Egg, Formula, Parent } from '../../entities';
import { FormulaStatus } from '../../enums';

export class FormulaParentResponseDto {
  @ApiProperty({ example: '486ce47e-831f-4f4e-b310-34ab3104c7ac' })
  id: string;

  @ApiProperty({ example: 'ريو' })
  name: string;

  constructor(parent: Parent) {
    this.id = parent.id ?? '';
    this.name = parent.name;
  }
}

export class FormulaEggResponseDto {
  @ApiProperty({ example: 'bed2423e-f36b-1410-8df1-0022b5e2ba07' })
  id: string;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  deliveredAt: Date;

  @ApiProperty({ example: new Date('2023-10-02T10:30:00Z'), nullable: true })
  transformedToPigeonAt?: Date;

  @ApiProperty({ example: 'e26d790b-4e79-4a08-8564-590bf5e7f52e', nullable: true })
  pigeonId?: string;

  constructor(egg: Egg) {
    this.id = egg.id;
    this.deliveredAt = egg.deliveredAt;
    this.transformedToPigeonAt = egg.transformedToPigeonAt;
    this.pigeonId = egg.pigeonId;
  }
}

export class FormulaChildResponseDto {
  @ApiProperty({ example: 'e26d790b-4e79-4a08-8564-590bf5e7f52e' })
  id: string;

  @ApiProperty({ example: 'ريو الصغير' })
  name: string;

  constructor(child: Child) {
    this.id = child.id;
    this.name = child.name;
  }
}

export class FormulaResponseDto {
  @ApiProperty({ example: 'e26d790b-4e79-4a08-8564-590bf5e7f52e' })
  id: string;

  @ApiProperty({ example: 'سمارين', nullable: true })
  boxNumber: string | null;

  @ApiProperty({ type: () => FormulaParentResponseDto })
  father: FormulaParentResponseDto;

  @ApiProperty({ type: () => FormulaParentResponseDto })
  mother: FormulaParentResponseDto;

  @ApiProperty({ enum: FormulaStatus, example: FormulaStatus.INITIATED })
  status: FormulaStatus;

  @ApiProperty({ type: () => [FormulaEggResponseDto] })
  eggs: FormulaEggResponseDto[];

  @ApiProperty({
    type: () => [FormulaChildResponseDto],
    description: 'Pigeon children born from this formula',
  })
  children: FormulaChildResponseDto[];

  @ApiProperty({ example: '2026' })
  yearOfFormula: string;

  @ApiProperty({ example: 'ملاحظة', nullable: true })
  notes: string | null;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  createdAt: Date;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  updatedAt: Date;

  constructor(formula: Formula) {
    this.id = formula.id;
    this.boxNumber = formula.boxNumber ?? null;
    this.father = new FormulaParentResponseDto(formula.father);
    this.mother = new FormulaParentResponseDto(formula.mother);
    this.status = formula.status;
    this.eggs = (formula.eggs ?? []).map((egg) => new FormulaEggResponseDto(egg));
    this.children = (formula.children ?? []).map((c) => new FormulaChildResponseDto(c));
    this.yearOfFormula = formula.yearOfFormula;
    this.notes = formula.notes ?? null;
    this.createdAt = formula.createdAt;
    this.updatedAt = formula.updatedAt;
  }
}
