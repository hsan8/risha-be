import { FirebaseService } from '@/core/services';
import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import _ from 'lodash';
import { HISTORY_CONSTANTS } from '../constants';
import { HistoryEvent } from '../entities';
import { HistoryEventType } from '../enums';

export interface CreateHistoryEventData {
  pigeonId: string;
  userId: string;
  eventType: HistoryEventType;
  eventDate: Date;
  note?: string;
}

@Injectable()
export class HistoryRepository {
  private readonly logger = new Logger(HistoryRepository.name);
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(HISTORY_CONSTANTS.COLLECTION_NAME);
  }

  private getUserHistoryRef(userId: string, pigeonId: string): Reference {
    return this.collectionRef.child(userId).child(pigeonId);
  }

  async create(data: CreateHistoryEventData): Promise<HistoryEvent> {
    const userHistoryRef = this.getUserHistoryRef(data.userId, data.pigeonId);
    const eventRef = userHistoryRef.push();
    const id = eventRef.key;

    const now = new Date();
    const payload: Omit<HistoryEvent, 'eventDate' | 'createdAt'> & { eventDate: string; createdAt: Date } = {
      id: id!,
      pigeonId: data.pigeonId,
      userId: data.userId,
      eventType: data.eventType,
      eventDate: data.eventDate.toISOString(),
      createdAt: now,
      ...(data.note && { note: data.note }),
    };

    await eventRef.set({ ...payload, createdAt: payload.createdAt.toISOString() });

    return {
      ...payload,
      eventDate: data.eventDate,
      createdAt: now,
    } as HistoryEvent;
  }

  async findByPigeonId(userId: string, pigeonId: string): Promise<HistoryEvent[]> {
    const userHistoryRef = this.getUserHistoryRef(userId, pigeonId);
    const snapshot = await userHistoryRef.once('value');

    const data = snapshot.val();
    if (!snapshot.exists() || _.isNil(data) || !_.isPlainObject(data)) {
      return [];
    }

    const events = _.values(data) as Array<
      Omit<HistoryEvent, 'eventDate' | 'createdAt'> & { eventDate: string; createdAt: string }
    >;
    return events.map((e) => ({
      ...e,
      eventDate: new Date(e.eventDate),
      createdAt: new Date(e.createdAt),
    })) as HistoryEvent[];
  }
}
