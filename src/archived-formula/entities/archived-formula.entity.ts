import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Formula } from '@/formula/entities';

export class ArchivedFormula {
  @ApiProperty({ description: 'Unique identifier for the archived record' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Original formula ID when it was active' })
  @IsString()
  originalFormulaId: string;

  @ApiProperty({ description: 'User ID who owned the formula when archived' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Reason for archiving (e.g. EGGS_DESTROYED)' })
  @IsString()
  archiveReason: string;

  @ApiProperty({ description: 'When the formula was archived' })
  @IsDate()
  archivedAt: Date;

  @ApiProperty({ description: 'Snapshot of the formula at archive time' })
  formulaSnapshot: Formula;
}
