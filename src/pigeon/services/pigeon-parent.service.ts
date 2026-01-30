import { Injectable, Logger } from '@nestjs/common';
import { Pigeon } from '../entities';
import { IAliveParentsResult } from '../interfaces';
import { PigeonGender, PigeonStatus } from '../enums';
import { PigeonService } from './pigeon.service';
import _ from 'lodash';

@Injectable()
export class PigeonParentService {
  private readonly logger = new Logger(PigeonParentService.name);

  constructor(private pigeonService: PigeonService) {}

  async findAliveParents(userId: string): Promise<IAliveParentsResult> {
    try {
      const pigeons = await this.pigeonService.findAllPigeonsByUserId(userId);

      return this.filterParentsAlive(pigeons);
    } catch (error) {
      this.logger.error('Error finding alive parents:', error);
      throw error;
    }
  }

  private filterParentsAlive(pigeons: Pigeon[]): IAliveParentsResult {
    const parents = this.findParents(pigeons);
    const aliveFathers = _.filter(parents.fathers, (father) => father.status === PigeonStatus.ALIVE);
    const aliveMothers = _.filter(parents.mothers, (mother) => mother.status === PigeonStatus.ALIVE);
    return { fathers: aliveFathers, mothers: aliveMothers };
  }

  private findParents(pigeons: Pigeon[]): IAliveParentsResult {
    const [fathers, mothers] = _.partition(pigeons, (pigeon) => pigeon.gender === PigeonGender.MALE);
    return { fathers, mothers };
  }
}
