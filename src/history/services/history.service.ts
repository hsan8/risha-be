import { UserLocale } from '@/core/enums';
import { PigeonService } from '@/pigeon/services';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { HISTORY_EVENT_LABELS_I18N } from '../constants';
import { CreateHistoryEventRequestDto } from '../dto/requests';
import { HistoryEvent } from '../entities';
import { HistoryRepository } from '../repositories';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    private readonly historyRepository: HistoryRepository,
    @Inject(forwardRef(() => PigeonService)) private readonly pigeonService: PigeonService,
  ) {}

  async create(pigeonId: string, userId: string, dto: CreateHistoryEventRequestDto): Promise<HistoryEvent> {
    await this.pigeonService.findOne(pigeonId, userId);

    const eventDate = moment(dto.eventDate).toDate();
    const event = await this.historyRepository.create({
      pigeonId,
      userId,
      eventType: dto.eventType,
      eventDate,
      note: dto.note,
    });

    this.logger.log(`History event created for pigeon ${pigeonId}: ${dto.eventType}`);
    return event;
  }

  async findByPigeonId(userId: string, pigeonId: string): Promise<HistoryEvent[]> {
    await this.pigeonService.findOne(pigeonId, userId);

    const events = await this.historyRepository.findByPigeonId(userId, pigeonId);
    events.sort((a, b) => moment(a.eventDate).valueOf() - moment(b.eventDate).valueOf());
    return events;
  }

  getEventLabel(eventType: string, locale: UserLocale): string {
    const labels = HISTORY_EVENT_LABELS_I18N[eventType];
    if (!labels) return eventType;
    return labels[locale] ?? labels[UserLocale.ARABIC];
  }
}
