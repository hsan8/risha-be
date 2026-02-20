import { HistoryEventType } from '@/history/enums';
import { HistoryService } from '@/history/services';
import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';
import { Pigeon } from '../entities';
import { PigeonGender, PigeonStatus } from '../enums';
import { IVaccinationRecord } from '../interfaces';
import { PigeonRepository } from '../repositories';
import { PigeonService } from './pigeon.service';

@Injectable()
export class PigeonStatusService {
  private readonly logger = new Logger(PigeonStatusService.name);

  constructor(
    private readonly pigeonService: PigeonService,
    private readonly pigeonRepository: PigeonRepository,
    private readonly historyService: HistoryService,
  ) {}

  async findAlivePigeons(userId: string): Promise<Pigeon[]> {
    try {
      const pigeons = await this.pigeonService.findAllPigeonsByUserId(userId);
      const alivePigeons = this.filterPigeonsByStatus(pigeons, PigeonStatus.ALIVE);

      return alivePigeons;
    } catch (error) {
      this.logger.error('Error finding alive pigeons:', error);
      throw error;
    }
  }

  async count(userId: string): Promise<number> {
    try {
      const pigeons = await this.pigeonService.findAllPigeonsByUserId(userId);
      return pigeons.length;
    } catch (error) {
      this.logger.error('Error counting pigeons:', error);
      throw error;
    }
  }

  async countByStatus(
    status: PigeonStatus,
    userId: string,
  ): Promise<{ total: number; maleCount: number; femaleCount: number }> {
    try {
      const pigeons = await this.pigeonService.findAllPigeonsByUserId(userId);

      const filteredPigeons = this.filterPigeonsByStatus(pigeons, status);
      const [maleCount, femaleCount] = _.partition(filteredPigeons, (pigeon) => pigeon.gender === PigeonGender.MALE);

      return {
        total: filteredPigeons.length,
        maleCount: maleCount.length,
        femaleCount: femaleCount.length,
      };
    } catch (error) {
      this.logger.error(`Error counting pigeons by status ${status}:`, error);
      throw error;
    }
  }

  async registerVaccinated(pigeonId: string, vaccinationRecord: IVaccinationRecord, userId: string): Promise<Pigeon> {
    try {
      const pigeon = await this.pigeonService.findOne(pigeonId, userId);
      if (!pigeon.vaccinationDates) {
        pigeon.vaccinationDates = [];
      }

      pigeon.vaccinationDates.push({
        date: vaccinationRecord.date,
        vaccine: vaccinationRecord.vaccine,
        note: vaccinationRecord.note,
      });

      await this.pigeonRepository.update(pigeonId, pigeon, userId);
      await this.historyService.create(pigeonId, userId, {
        eventType: HistoryEventType.PIGEON_VACCINATED,
        eventDate: moment(vaccinationRecord.date).toISOString(),
        note: vaccinationRecord.note ?? '',
      });
      const updatedPigeon = await this.pigeonService.findOne(pigeonId, userId);
      return updatedPigeon;
    } catch (error) {
      this.logger.error('Error registering pigeon as vaccinated:', error);
      throw error;
    }
  }

  private filterPigeonsByStatus(pigeons: Pigeon[], status: PigeonStatus): Pigeon[] {
    return _.filter(pigeons, (pigeon) => pigeon.status === status);
  }
}
