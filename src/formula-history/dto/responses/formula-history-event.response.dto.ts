import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({ description: 'Previous box number; present when action is BOX_NUMBER_UPDATED' })
  previousBoxNumber?: string;

  @ApiPropertyOptional({ description: 'New box number; present when action is BOX_NUMBER_UPDATED' })
  newBoxNumber?: string;

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
    this.previousBoxNumber = event.params?.previousBoxNumber;
    this.newBoxNumber = event.params?.newBoxNumber;
    this.date = event.date;
    this.createdAt = event.createdAt;
  }
}
