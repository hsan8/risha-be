import { I18nMessage } from '@/core/utils/i18n-message.util';
import { HistoryEvent } from '@/history/entities';
import { HistoryEventType } from '@/history/enums';
import { HistoryRepository } from '@/history/repositories';
import { Pigeon } from '@/pigeon/entities';
import { PigeonStatus } from '@/pigeon/enums';
import { PigeonRepository } from '@/pigeon/repositories';
import { PigeonService } from '@/pigeon/services';
import { UserStatisticsService } from '@/user/services';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';
import { ArchivePigeonRequestDto } from '../dto/requests';
import { ArchivedPigeon } from '../entities';
import { IArchivedPigeonRaw } from '../interfaces';
import { ArchivedPigeonRepository } from '../repositories';
import { fromArchiveFirebaseSnapshot } from '../utils';

@Injectable()
export class ArchivedPigeonService {
  private readonly logger = new Logger(ArchivedPigeonService.name);

  constructor(
    private readonly archivedPigeonRepository: ArchivedPigeonRepository,
    private readonly pigeonService: PigeonService,
    private readonly pigeonRepository: PigeonRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly userStatisticsService: UserStatisticsService,
  ) {}

  async archivePigeon(pigeonId: string, userId: string, dto: ArchivePigeonRequestDto): Promise<ArchivedPigeon> {
    const pigeon = await this.pigeonService.findOne(pigeonId, userId);
    const historyRecords = await this.historyRepository.findByPigeonId(userId, pigeonId);

    const archived = await this.archivedPigeonRepository.create({
      originalPigeonId: pigeonId,
      userId,
      archiveReason: dto.reason,
      pigeonSnapshot: pigeon,
      historyRecords,
      note: dto.note,
      newOwnerId: dto.newOwnerId,
    });

    const wasAlive = pigeon.status === PigeonStatus.ALIVE;
    await this.userStatisticsService.decrementPigeonCount(userId, pigeon.gender, wasAlive);

    await this.pigeonRepository.delete(pigeonId, userId);
    await this.historyRepository.deleteByPigeonId(userId, pigeonId);

    this.logger.log(`Pigeon ${pigeonId} archived (${dto.reason}) for user ${userId}`);
    return archived;
  }

  async findAll(userId: string): Promise<IArchivedPigeonRaw[]> {
    return this.archivedPigeonRepository.findAll(userId);
  }

  async deleteArchived(archivedPigeonId: string, userId: string): Promise<void> {
    const raw = await this.archivedPigeonRepository.findById(userId, archivedPigeonId);
    if (!raw) {
      throw new NotFoundException(I18nMessage.error('archivedRecordNotFound'));
    }
    await this.archivedPigeonRepository.delete(userId, archivedPigeonId);
    this.logger.log(`Archived pigeon record ${archivedPigeonId} removed (permanent delete) for user ${userId}`);
  }

  /** Restores pigeon + bundled history to active collections and deletes the archive row. */
  async restoreArchived(archivedPigeonId: string, userId: string): Promise<Pigeon> {
    const raw = await this.archivedPigeonRepository.findById(userId, archivedPigeonId);
    if (!raw) {
      throw new NotFoundException(I18nMessage.error('archivedRecordNotFound'));
    }

    const pigeon = fromArchiveFirebaseSnapshot(raw.pigeonSnapshot as Record<string, unknown>);
    pigeon.id = raw.originalPigeonId;

    const existingById = await this.pigeonRepository.findById(pigeon.id, userId);
    if (existingById) {
      throw new ConflictException(I18nMessage.error('cannotRestoreActivePigeon'));
    }

    const ringConflict = await this.pigeonRepository.findByRingNoAndYearOfRegistration(
      pigeon.ringNo,
      pigeon.yearOfRegistration,
      userId,
    );
    if (ringConflict) {
      throw new ConflictException(
        I18nMessage.error('duplicateRingNumberForYear', {
          ringNo: pigeon.ringNo,
          yearOfRegistration: pigeon.yearOfRegistration,
        }),
      );
    }

    const historyEvents: HistoryEvent[] = (raw.historyRecords ?? []).map((h) => ({
      id: h.id,
      pigeonId: pigeon.id,
      userId: h.userId,
      eventType: h.eventType as HistoryEventType,
      eventDate: moment(h.eventDate).toDate(),
      createdAt: moment(h.createdAt).toDate(),
      ...(h.note != null && String(h.note) !== '' ? { note: String(h.note) } : {}),
    }));

    await this.pigeonRepository.restoreFullPigeon(userId, pigeon);
    await this.historyRepository.replaceAllForPigeon(userId, pigeon.id, historyEvents);

    const wasAlive = pigeon.status === PigeonStatus.ALIVE;
    await this.userStatisticsService.incrementPigeonCount(userId, pigeon.gender, wasAlive);

    await this.archivedPigeonRepository.delete(userId, archivedPigeonId);

    const restored = await this.pigeonRepository.findById(pigeon.id, userId);
    if (!restored) {
      this.logger.error(`Pigeon ${pigeon.id} missing after restore from archive ${archivedPigeonId}`);
      throw new InternalServerErrorException();
    }
    this.logger.log(`Pigeon ${pigeon.id} restored from archive record ${archivedPigeonId}`);
    return restored;
  }
}
