import { ApiProperty } from '@nestjs/swagger';
import { Formula } from '../../entities';

export class FormulaResponseDto {
  @ApiProperty({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  id: string;

  @ApiProperty({ example: 'CASE-2024-001' })
  caseNumber: string;

  @ApiProperty({ example: '2024' })
  yearOfFormula: string;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  createdAt: Date;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  updatedAt: Date;

  constructor(formula: Formula) {
    this.id = formula.id;
    this.caseNumber = formula.caseNumber;
    this.yearOfFormula = formula.yearOfFormula;
    this.createdAt = formula.createdAt;
    this.updatedAt = formula.updatedAt;
  }
}
