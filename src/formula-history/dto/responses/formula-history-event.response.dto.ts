import { ApiProperty } from '@nestjs/swagger';
import { FormulaActions } from '@/formula/enums';
import { FormulaHistoryEvent } from '../../entities';

export class FormulaHistoryEventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  formulaId: string;

  @ApiProperty({ enum: FormulaActions })
  action: FormulaActions;

  @ApiProperty({ description: 'Localized label for the action' })
  label: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  constructor(event: FormulaHistoryEvent, label: string) {
    this.id = event.id;
    this.formulaId = event.formulaId;
    this.action = event.action;
    this.label = label;
    this.description = event.description;
    this.date = event.date;
    this.createdAt = event.createdAt;
  }
}
