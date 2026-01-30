import { Injectable, Logger } from '@nestjs/common';
import { PigeonService } from './pigeon.service';
import { Pigeon } from '../entities';
import { PigeonStatistics } from '@/user/entities';
import { PigeonGender, PigeonStatus } from '../enums';
import _ from 'lodash';
import moment from 'moment';

@Injectable()
export class PigeonStatusService {
  private readonly logger = new Logger(PigeonStatusService.name);

  constructor(private readonly pigeonService: PigeonService) {}

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

  private filterPigeonsByStatus(pigeons: Pigeon[], status: PigeonStatus): Pigeon[] {
    return _.filter(pigeons, (pigeon) => pigeon.status === status);
  }
}
