import { I18nMessage } from '@/core/utils/i18n-message.util';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { Pigeon } from '../entities';
import { normalizeRingNo } from '../utils/normalize-ring-no.util';
import { PigeonService } from './pigeon.service';

@Injectable()
export class PigeonSearchService {
  private readonly logger = new Logger(PigeonSearchService.name);

  constructor(private readonly pigeonService: PigeonService) {}

  async search(query: string, userId: string): Promise<Pigeon[]> {
    try {
      const pigeons = await this.pigeonService.findAllPigeonsByUserId(userId);
      const words = _.words(_.toLower(_.trim(query)));
      if (_.isEmpty(words)) {
        return pigeons;
      }

      const searchableValues = (pigeon: Pigeon): string[] =>
        _.map(
          [
            pigeon.name,
            pigeon.fatherName,
            pigeon.motherName,
            pigeon.yearOfRegistration,
            pigeon.letterOfRegistration,
            normalizeRingNo(pigeon.ringNo),
          ],
          (v) => _.toLower(_.toString(v ?? '')),
        );

      return _.filter(pigeons, (pigeon) => {
        const values = searchableValues(pigeon);
        return _.some(
          words,
          (word) =>
            _.some(values, (value) => _.includes(value, word) || _.includes(value, _.toLower(normalizeRingNo(word)))),
        );
      });
    } catch (error) {
      this.logger.error('Error searching pigeons:', error);
      throw error;
    }
  }

  async findByRingNo(ringNo: string, userId: string): Promise<Pigeon> {
    try {
      const pigeons = await this.pigeonService.findAllPigeonsByUserId(userId);
      const pigeon = _.find(
        pigeons,
        (p) => normalizeRingNo(p.ringNo) === normalizeRingNo(ringNo),
      );

      if (!pigeon) {
        throw new NotFoundException(I18nMessage.error('notFound'));
      }
      return pigeon;
    } catch (error) {
      this.logger.error(`Error finding pigeon by ring number ${ringNo}:`, error);
      throw error;
    }
  }
}
