import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { FirebaseService } from '@/core/services';
import { UserStatistics, PigeonStatistics } from '@/user/entities';

@Injectable()
export class UserStatisticsRepository {
  private readonly logger = new Logger(UserStatisticsRepository.name);
  private readonly db: Database;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
  }

  private getUserStatisticsRef(userId: string): Reference {
    return this.db.ref(`users/${userId}/statistics`);
  }

  async initializeStatistics(userId: string): Promise<UserStatistics> {
    const statisticsRef = this.getUserStatisticsRef(userId);

    const now = new Date();
    const initialStatistics: UserStatistics = {
      userId,
      pigeons: {
        maleCount: 0,
        femaleCount: 0,
        totalCount: 0,
        aliveCount: 0,
        deadCount: 0,
        lastUpdated: now,
      },
      createdAt: now,
      updatedAt: now,
    };

    await statisticsRef.set(initialStatistics);
    return initialStatistics;
  }

  async getStatistics(userId: string): Promise<UserStatistics | null> {
    const statisticsRef = this.getUserStatisticsRef(userId);
    const snapshot = await statisticsRef.once('value');

    if (!snapshot.exists()) {
      return await this.initializeStatistics(userId);
    }

    return snapshot.val() as UserStatistics;
  }

  async updatePigeonStatistics(userId: string, pigeonStats: Partial<PigeonStatistics>): Promise<void> {
    const statisticsRef = this.getUserStatisticsRef(userId);
    const now = new Date();

    await statisticsRef.update({
      pigeons: {
        ...pigeonStats,
        lastUpdated: now,
      },
      updatedAt: now,
    });
  }

  async incrementPigeonCount(userId: string, gender: 'male' | 'female', isAlive: boolean = true): Promise<void> {
    const statistics = await this.getStatistics(userId);
    if (!statistics) return;

    const updates: Partial<PigeonStatistics> = {
      totalCount: statistics.pigeons.totalCount + 1,
      lastUpdated: new Date(),
    };

    if (gender === 'male') {
      updates.maleCount = statistics.pigeons.maleCount + 1;
    } else {
      updates.femaleCount = statistics.pigeons.femaleCount + 1;
    }

    if (isAlive) {
      updates.aliveCount = statistics.pigeons.aliveCount + 1;
    } else {
      updates.deadCount = statistics.pigeons.deadCount + 1;
    }

    await this.updatePigeonStatistics(userId, updates);
  }

  async decrementPigeonCount(userId: string, gender: 'male' | 'female', wasAlive: boolean = true): Promise<void> {
    const statistics = await this.getStatistics(userId);
    if (!statistics) return;

    const updates: Partial<PigeonStatistics> = {
      totalCount: Math.max(0, statistics.pigeons.totalCount - 1),
      lastUpdated: new Date(),
    };

    if (gender === 'male') {
      updates.maleCount = Math.max(0, statistics.pigeons.maleCount - 1);
    } else {
      updates.femaleCount = Math.max(0, statistics.pigeons.femaleCount - 1);
    }

    if (wasAlive) {
      updates.aliveCount = Math.max(0, statistics.pigeons.aliveCount - 1);
    } else {
      updates.deadCount = Math.max(0, statistics.pigeons.deadCount - 1);
    }

    await this.updatePigeonStatistics(userId, updates);
  }

  async updatePigeonStatus(userId: string, fromAlive: boolean, toAlive: boolean): Promise<void> {
    if (fromAlive === toAlive) return;

    const statistics = await this.getStatistics(userId);
    if (!statistics) return;

    const updates: Partial<PigeonStatistics> = {
      lastUpdated: new Date(),
    };

    if (fromAlive && !toAlive) {
      updates.aliveCount = Math.max(0, statistics.pigeons.aliveCount - 1);
      updates.deadCount = statistics.pigeons.deadCount + 1;
    } else if (!fromAlive && toAlive) {
      updates.aliveCount = statistics.pigeons.aliveCount + 1;
      updates.deadCount = Math.max(0, statistics.pigeons.deadCount - 1);
    }

    await this.updatePigeonStatistics(userId, updates);
  }

  async recalculateStatistics(userId: string, pigeonData: { gender: string; status: string }[]): Promise<void> {
    let maleCount = 0;
    let femaleCount = 0;
    let aliveCount = 0;
    let deadCount = 0;

    pigeonData.forEach((pigeon) => {
      if (pigeon.gender === 'MALE') maleCount++;
      if (pigeon.gender === 'FEMALE') femaleCount++;
      if (pigeon.status === 'ALIVE') aliveCount++;
      if (pigeon.status === 'DEAD') deadCount++;
    });

    const updates: Partial<PigeonStatistics> = {
      maleCount,
      femaleCount,
      totalCount: pigeonData.length,
      aliveCount,
      deadCount,
      lastUpdated: new Date(),
    };

    await this.updatePigeonStatistics(userId, updates);
  }
}
