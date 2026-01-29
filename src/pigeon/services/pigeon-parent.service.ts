import { Injectable, Logger } from '@nestjs/common';
import { PigeonRepository } from '@/pigeon/repositories';
import { Pigeon } from '../entities';

@Injectable()
export class PigeonParentService {
  private readonly logger = new Logger(PigeonParentService.name);

  constructor(private readonly pigeonRepository: PigeonRepository) {}

  async findAliveParents(userId: string): Promise<{ fathers: Pigeon[]; mothers: Pigeon[] }> {
    try {
      return await this.pigeonRepository.findAliveParents(userId);
    } catch (error) {
      this.logger.error('Error finding alive parents:', error);
      throw error;
    }
  }
}
