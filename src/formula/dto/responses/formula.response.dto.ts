import { ApiProperty } from '@nestjs/swagger';
import { Formula, Parent } from '../../entities';

export class FormulaParentResponseDto {
  @ApiProperty({ example: '486ce47e-831f-4f4e-b310-34ab3104c7ac' })
  id: string;

  @ApiProperty({ example: 'ريو' })
  name: string;

  constructor(parent: Parent) {
    this.id = parent.id;
    this.name = parent.name;
  }
}

export class FormulaResponseDto {
  @ApiProperty({ example: 'e26d790b-4e79-4a08-8564-590bf5e7f52e' })
  id: string;

  @ApiProperty({ example: 'سمارين', nullable: true })
  caseNumber: string;

  @ApiProperty({ type: () => FormulaParentResponseDto })
  father: FormulaParentResponseDto;

  @ApiProperty({ type: () => FormulaParentResponseDto })
  mother: FormulaParentResponseDto;

  @ApiProperty({
    example: 'INITIATED',
    enum: ['INITIATED', 'TERMINATED', 'HAS_ONE_EGG', 'HAS_TWO_EGG', 'HAS_ONE_PIGEON', 'HAS_TWO_PIGEON'],
  })
  status: string;

  @ApiProperty({ example: '2026' })
  yearOfFormula: string;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  createdAt: Date;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  updatedAt: Date;

  constructor(formula: Formula) {
    this.id = formula.id;
    this.caseNumber = formula.caseNumber ?? undefined;
    this.father = new FormulaParentResponseDto(formula.father);
    this.mother = new FormulaParentResponseDto(formula.mother);
    this.status = formula.status;
    this.yearOfFormula = formula.yearOfFormula;
    this.createdAt = formula.createdAt;
    this.updatedAt = formula.updatedAt;
  }
}
