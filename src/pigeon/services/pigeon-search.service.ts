import { Injectable, Logger } from '@nestjs/common';
import { PigeonRepository } from '@/pigeon/repositories';
import { Pigeon } from '../entities';

@Injectable()
export class PigeonSearchService {
  private readonly logger = new Logger(PigeonSearchService.name);

  constructor(private readonly pigeonRepository: PigeonRepository) {}

  async search(query: string, userId: string): Promise<Pigeon[]> {
    try {
      return await this.pigeonRepository.search(query, userId);
    } catch (error) {
      this.logger.error('Error searching pigeons:', error);
      throw error;
    }
  }

  async findByRingNo(ringNo: string, userId: string): Promise<Pigeon | null> {
    try {
      return await this.pigeonRepository.findByRingNo(ringNo, userId);
    } catch (error) {
      this.logger.error(`Error finding pigeon by ring number ${ringNo}:`, error);
      throw error;
    }
  }

  async findByDocumentationNo(documentationNo: string, userId: string): Promise<Pigeon | null> {
    try {
      return await this.pigeonRepository.findByDocumentationNo(documentationNo, userId);
    } catch (error) {
      this.logger.error(`Error finding pigeon by documentation number ${documentationNo}:`, error);
      throw error;
    }
  }
}
