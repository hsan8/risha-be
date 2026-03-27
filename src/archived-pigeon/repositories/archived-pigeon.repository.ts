import { FirebaseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
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
    const id = uuidv4();
    const ref = this.getUserRef(data.userId).child(id);

    const payload = this.buildCreatePayload(data, id);
    await ref.set(payload);

    const entity = this.dataToEntity(data, id);
    return entity;
  }

  private buildCreatePayload(data: ICreateArchivedPigeonData, id: string): Record<string, unknown> {
    const now = moment().toDate();
    const historyRecords = (data.historyRecords ?? []).map((e) => ({
      id: e.id,
      pigeonId: e.pigeonId,
      userId: e.userId,
      eventType: e.eventType,
      eventDate: moment(e.eventDate).toISOString(),
      note: e.note ?? null,
      createdAt: moment(e.createdAt).toISOString(),
    }));
    return {
      id,
      originalPigeonId: data.originalPigeonId,
      userId: data.userId,
      archiveReason: data.archiveReason,
      archivedAt: moment(now).toISOString(),
      pigeonSnapshot: toFirebaseSnapshot(data.pigeonSnapshot),
      historyRecords,
      note: data.note ?? null,
      newOwnerId: data.newOwnerId ?? null,
    };
  }

  private dataToEntity(data: ICreateArchivedPigeonData, id: string): ArchivedPigeon {
    const now = moment().toDate();
    return {
      id,
      originalPigeonId: data.originalPigeonId,
      userId: data.userId,
      archiveReason: data.archiveReason,
      archivedAt: now,
      pigeonSnapshot: data.pigeonSnapshot,
      historyRecords: data.historyRecords ?? [],
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

  async findById(userId: string, archivedPigeonId: string): Promise<IArchivedPigeonRaw | null> {
    const snapshot = await this.getUserRef(userId).child(archivedPigeonId).once('value');
    if (!snapshot.exists()) return null;
    return snapshot.val() as IArchivedPigeonRaw;
  }

  async delete(userId: string, archivedPigeonId: string): Promise<void> {
    await this.getUserRef(userId).child(archivedPigeonId).remove();
  }
}
