import { I18nMessage } from '@/core/utils/i18n-message.util';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Pigeon } from '../entities';
import { PigeonRepository } from '../repositories';

@Injectable()
export class DocumentationNumberService {
  private readonly logger = new Logger(DocumentationNumberService.name);

  constructor(private readonly pigeonRepository: PigeonRepository) {}

  async findByYearOfRegistrationAndLetter(
    yearOfRegistration: string,
    letterOfRegistration: string,
    userId: string,
  ): Promise<Pigeon> {
    try {
      const pigeon = await this.pigeonRepository.findByYearOfRegistrationAndLetter(
        yearOfRegistration,
        letterOfRegistration,
        userId,
      );

      if (!pigeon) {
        throw new NotFoundException(I18nMessage.error('notFound'));
      }
      return pigeon;
    } catch (error) {
      this.logger.error(
        `Error finding pigeon by year of registration ${yearOfRegistration} and letter ${letterOfRegistration}:`,
        error,
      );

      throw error;
    }
  }
}
