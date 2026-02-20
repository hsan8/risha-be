import { FirebaseService } from '@/core/services';
import { PigeonGender, PigeonStatus } from '@/pigeon/enums';
import { PigeonStatistics, UserStatistics } from '@/user/entities';
import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import moment from 'moment';

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

  /** Ensure value is a non-NaN number for Firebase (default 0 if missing/invalid). */
  private num(v: unknown): number {
    const n = typeof v === 'number' && !Number.isNaN(v) ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  async initializeStatistics(userId: string): Promise<UserStatistics> {
    const statisticsRef = this.getUserStatisticsRef(userId);
    const initialStatistics = this.buildInitialStatistics(userId);
    await statisticsRef.set(initialStatistics);
    return initialStatistics;
  }

  private buildInitialStatistics(userId: string): UserStatistics {
    const now = moment().toDate();
    return {
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
    const now = moment().toDate();

    await statisticsRef.update({
      pigeons: {
        ...pigeonStats,
        lastUpdated: now,
      },
      updatedAt: now,
    });
  }

  async incrementPigeonCount(userId: string, gender: PigeonGender, isAlive: boolean = true): Promise<void> {
    const statistics = await this.getStatistics(userId);
    if (!statistics) return;

    const p = statistics.pigeons;
    const updates: Partial<PigeonStatistics> = {
      totalCount: this.num(p.totalCount) + 1,
      lastUpdated: moment().toDate(),
    };
    if (gender === PigeonGender.MALE) {
      updates.maleCount = this.num(p.maleCount) + 1;
    } else {
      updates.femaleCount = this.num(p.femaleCount) + 1;
    }
    if (isAlive) {
      updates.aliveCount = this.num(p.aliveCount) + 1;
    } else {
      updates.deadCount = this.num(p.deadCount) + 1;
    }
    await this.updatePigeonStatistics(userId, updates);
  }

  async decrementPigeonCount(userId: string, gender: PigeonGender, wasAlive: boolean = true): Promise<void> {
    const statistics = await this.getStatistics(userId);
    if (!statistics) return;

    const p = statistics.pigeons;
    const updates: Partial<PigeonStatistics> = {
      totalCount: Math.max(0, this.num(p.totalCount) - 1),
      lastUpdated: new Date(),
    };
    if (gender === PigeonGender.MALE) {
      updates.maleCount = Math.max(0, this.num(p.maleCount) - 1);
    } else {
      updates.femaleCount = Math.max(0, this.num(p.femaleCount) - 1);
    }
    if (wasAlive) {
      updates.aliveCount = Math.max(0, this.num(p.aliveCount) - 1);
    } else {
      updates.deadCount = Math.max(0, this.num(p.deadCount) - 1);
    }
    await this.updatePigeonStatistics(userId, updates);
  }

  async updatePigeonStatus(userId: string, fromAlive: boolean, toAlive: boolean): Promise<void> {
    if (fromAlive === toAlive) return;

    const statistics = await this.getStatistics(userId);
    if (!statistics) return;

    const p = statistics.pigeons;
    const updates: Partial<PigeonStatistics> = { lastUpdated: moment().toDate() };
    if (fromAlive && !toAlive) {
      updates.aliveCount = Math.max(0, this.num(p.aliveCount) - 1);
      updates.deadCount = this.num(p.deadCount) + 1;
    } else if (!fromAlive && toAlive) {
      updates.aliveCount = this.num(p.aliveCount) + 1;
      updates.deadCount = Math.max(0, this.num(p.deadCount) - 1);
    }
    await this.updatePigeonStatistics(userId, updates);
  }

  async recalculateStatistics(
    userId: string,
    pigeonData: { gender: PigeonGender; status: PigeonStatus }[],
  ): Promise<void> {
    let maleCount = 0;
    let femaleCount = 0;
    let aliveCount = 0;
    let deadCount = 0;

    pigeonData.forEach((pigeon) => {
      if (pigeon.gender === PigeonGender.MALE) maleCount++;
      if (pigeon.gender === PigeonGender.FEMALE) femaleCount++;
      if (pigeon.status === PigeonStatus.ALIVE) aliveCount++;
      if (pigeon.status === PigeonStatus.DEAD) deadCount++;
    });

    const updates: Partial<PigeonStatistics> = {
      maleCount,
      femaleCount,
      totalCount: pigeonData.length,
      aliveCount,
      deadCount,
      lastUpdated: moment().toDate(),
    };

    await this.updatePigeonStatistics(userId, updates);
  }
}
