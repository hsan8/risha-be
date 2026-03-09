import { FormulaService } from '@/formula/services';
import { FormulaActions } from '@/formula/enums';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { FORMULA_ACTION_LABELS_I18N } from '../constants';
import { FormulaHistoryEvent } from '../entities';
import { CreateFormulaHistoryEventData } from '../repositories/formula-history.repository';
import { FormulaHistoryRepository } from '../repositories';
import { UserLocale } from '@/core/enums';

@Injectable()
export class FormulaHistoryService {
  private readonly logger = new Logger(FormulaHistoryService.name);

  constructor(
    private readonly formulaHistoryRepository: FormulaHistoryRepository,
    @Inject(forwardRef(() => FormulaService)) private readonly formulaService: FormulaService,
  ) {}

  async create(data: CreateFormulaHistoryEventData): Promise<FormulaHistoryEvent> {
    await this.formulaService.getFormulaById(data.formulaId, data.userId);
    const event = await this.formulaHistoryRepository.create(data);
    this.logger.log(`Formula history event created for formula ${data.formulaId}: ${data.action}`);
    return event;
  }

  async findByFormulaId(userId: string, formulaId: string): Promise<FormulaHistoryEvent[]> {
    await this.formulaService.getFormulaById(formulaId, userId);
    const events = await this.formulaHistoryRepository.findByFormulaId(userId, formulaId);
    events.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());
    return events;
  }

  getEventLabel(event: FormulaHistoryEvent, locale: UserLocale): string {
    const { action, params } = event;
    const labels = FORMULA_ACTION_LABELS_I18N[action];
    if (!labels) return action;
    const label = labels[locale] ?? labels[UserLocale.ARABIC];
    if (typeof label === 'function' && params?.previousBoxNumber !== undefined && params?.newBoxNumber !== undefined) {
      return label(params.previousBoxNumber, params.newBoxNumber);
    }
    return typeof label === 'string' ? label : action;
  }
}
