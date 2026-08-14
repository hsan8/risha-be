import { FirebaseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import moment from 'moment';
import { BlockedUser } from '../entities/blocked-user.entity';

const BLOCKED_USERS_COLLECTION = 'blockedUsers';

@Injectable()
export class BlockedUserRepository {
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(BLOCKED_USERS_COLLECTION);
  }

  async block(blockingUserId: string, blockedUserId: string): Promise<BlockedUser> {
    const entry: BlockedUser = {
      blockingUserId,
      blockedUserId,
      createdAt: moment().toDate(),
    };

    await this.collectionRef
      .child(blockingUserId)
      .child(blockedUserId)
      .set({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
      });

    return entry;
  }

  async unblock(blockingUserId: string, blockedUserId: string): Promise<void> {
    await this.collectionRef.child(blockingUserId).child(blockedUserId).remove();
  }

  async isBlocked(blockingUserId: string, blockedUserId: string): Promise<boolean> {
    const snapshot = await this.collectionRef
      .child(blockingUserId)
      .child(blockedUserId)
      .once('value');
    return snapshot.exists();
  }

  async findBlockedUserIds(blockingUserId: string): Promise<string[]> {
    const snapshot = await this.collectionRef.child(blockingUserId).once('value');
    const data = snapshot.val();
    if (!data || typeof data !== 'object') return [];
    return Object.keys(data);
  }
}
