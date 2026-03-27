import { I18nMessage } from '@/core/utils/i18n-message.util';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ArchivedFormula } from '../entities';
import { ArchivedFormulaRepository } from '../repositories';

@Injectable()
export class ArchivedFormulaService {
  private readonly logger = new Logger(ArchivedFormulaService.name);

  constructor(private readonly archivedFormulaRepository: ArchivedFormulaRepository) {}

  async findAll(userId: string): Promise<ArchivedFormula[]> {
    return this.archivedFormulaRepository.findAllByUserId(userId);
  }

  async findById(id: string, userId: string): Promise<ArchivedFormula> {
    const archived = await this.archivedFormulaRepository.findById(id, userId);
    if (!archived) {
      throw new NotFoundException(I18nMessage.error('notFound'));
    }
    return archived;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.archivedFormulaRepository.delete(id, userId);
    this.logger.log(`Archived formula ${id} deleted for user ${userId}`);
  }
}
