import { FormulaResponseDto } from '@/formula/dto/responses';
import { Formula } from '@/formula/entities';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';
import { ArchivedFormula } from '../entities';

export class ArchivedFormulaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  originalFormulaId: string;

  @ApiProperty({ example: 'EGGS_DESTROYED' })
  archiveReason: string;

  @ApiProperty({ example: '2025-03-05T19:00:00.000Z' })
  archivedAt: Date;

  @ApiProperty({ type: () => FormulaResponseDto })
  formulaSnapshot: FormulaResponseDto;

  constructor(archived: ArchivedFormula) {
    this.id = archived.id;
    this.originalFormulaId = archived.originalFormulaId;
    this.archiveReason = archived.archiveReason;
    this.archivedAt = archived.archivedAt;
    this.formulaSnapshot = new FormulaResponseDto(archived.formulaSnapshot as Formula);
  }
}
