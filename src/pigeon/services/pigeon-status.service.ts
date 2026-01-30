import { Injectable, Logger } from '@nestjs/common';
import { PigeonRepository } from '@/pigeon/repositories';
import { PigeonService } from './pigeon.service';
import { Pigeon } from '../entities';
import { PigeonStatus } from '../enums';
import { UpdatePigeonRequestDto } from '../dto/requests';

@Injectable()
export class PigeonStatusService {
  private readonly logger = new Logger(PigeonStatusService.name);

  constructor(private readonly pigeonRepository: PigeonRepository, private readonly pigeonService: PigeonService) {}

  async findAlivePigeons(userId: string): Promise<Pigeon[]> {
    try {
      return await this.pigeonRepository.findAlivePigeons(userId);
    } catch (error) {
      this.logger.error('Error finding alive pigeons:', error);
      throw error;
    }
  }

  async count(userId: string): Promise<number> {
    try {
      return await this.pigeonRepository.count(userId);
    } catch (error) {
      this.logger.error('Error counting pigeons:', error);
      throw error;
    }
  }

  async countByStatus(status: PigeonStatus, userId: string): Promise<number> {
    try {
      return await this.pigeonRepository.countByStatus(status, userId);
    } catch (error) {
      this.logger.error(`Error counting pigeons by status ${status}:`, error);
      throw error;
    }
  }

  
}
