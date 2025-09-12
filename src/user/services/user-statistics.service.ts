import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserStatisticsRepository } from '../repositories';
import { PigeonStatistics } from '../entities';

@Injectable()
export class UserStatisticsService {
  private readonly logger = new Logger(UserStatisticsService.name);

  constructor(private readonly userStatisticsRepository: UserStatisticsRepository) {}

  async incrementPigeonCount(userId: string, gender: 'male' | 'female', isAlive: boolean): Promise<void> {
    try {
      await this.userStatisticsRepository.incrementPigeonCount(userId, gender, isAlive);
    } catch (error) {
      this.logger.error('Error incrementing pigeon count:', error);
      throw error;
    }
  }

  async decrementPigeonCount(userId: string, gender: 'male' | 'female', wasAlive: boolean): Promise<void> {
    try {
      await this.userStatisticsRepository.decrementPigeonCount(userId, gender, wasAlive);
    } catch (error) {
      this.logger.error('Error decrementing pigeon count:', error);
      throw error;
    }
  }

  async updatePigeonStatus(userId: string, fromAlive: boolean, toAlive: boolean): Promise<void> {
    try {
      await this.userStatisticsRepository.updatePigeonStatus(userId, fromAlive, toAlive);
    } catch (error) {
      this.logger.error('Error updating pigeon status:', error);
      throw error;
    }
  }

  async getPigeonStatistics(userId: string): Promise<PigeonStatistics> {
    try {
      const stats = await this.userStatisticsRepository.getStatistics(userId);
      if (!stats) {
        throw new NotFoundException('User statistics not found');
      }
      return stats.pigeons;
    } catch (error) {
      this.logger.error('Error getting pigeon statistics:', error);
      throw error;
    }
  }
}
