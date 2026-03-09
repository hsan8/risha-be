import { HistoryRepository } from '@/history/repositories';
import { PigeonStatus } from '@/pigeon/enums';
import { PigeonRepository } from '@/pigeon/repositories';
import { PigeonService } from '@/pigeon/services';
import { UserStatisticsService } from '@/user/services';
import { Injectable, Logger } from '@nestjs/common';
import { ArchivePigeonRequestDto } from '../dto/requests';
import { ArchivedPigeon } from '../entities';
import { IArchivedPigeonRaw } from '../interfaces';
import { ArchivedPigeonRepository } from '../repositories';

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
}
