import { FirebaseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import _ from 'lodash';
import moment from 'moment';
import { ARCHIVED_PIGEON_CONSTANTS } from '../constants';
import { ArchivedPigeon } from '../entities';
import { IArchivedPigeonRaw, ICreateArchivedPigeonData } from '../interfaces';
import { toFirebaseSnapshot } from '../utils';

@Injectable()
export class ArchivedPigeonRepository {
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(ARCHIVED_PIGEON_CONSTANTS.COLLECTION_NAME);
  }

  private getUserRef(userId: string): Reference {
    return this.collectionRef.child(userId);
  }

  async create(data: ICreateArchivedPigeonData): Promise<ArchivedPigeon> {
    const ref = this.getUserRef(data.userId).push();
    const id = ref.key!;
    const now = moment().toDate();

    const payload = {
      id,
      originalPigeonId: data.originalPigeonId,
      userId: data.userId,
      archiveReason: data.archiveReason,
      archivedAt: moment(now).toISOString(),
      pigeonSnapshot: toFirebaseSnapshot(data.pigeonSnapshot),
      note: data.note ?? null,
      newOwnerId: data.newOwnerId ?? null,
    };
    await ref.set(payload);

    return {
      ...payload,
      archivedAt: now,
      pigeonSnapshot: data.pigeonSnapshot,
      note: data.note,
      newOwnerId: data.newOwnerId,
    } as ArchivedPigeon;
  }

  async findAll(userId: string): Promise<IArchivedPigeonRaw[]> {
    const snapshot = await this.getUserRef(userId).once('value');
    const data = snapshot.val();
    if (!snapshot.exists() || _.isNil(data) || !_.isPlainObject(data)) return [];

    const list = _.values(data) as IArchivedPigeonRaw[];
    list.sort((a, b) => (b.archivedAt as string).localeCompare(a.archivedAt as string));
    return list;
  }
}
