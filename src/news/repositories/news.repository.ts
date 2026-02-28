import { FirebaseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { NEWS_CONSTANTS } from '../constants';
import { CreateNewsItemRequestDto } from '../dto/requests';
import { NewsItem } from '../entities';

@Injectable()
export class NewsRepository {
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(NEWS_CONSTANTS.COLLECTION_NAME);
  }

  async create(data: CreateNewsItemRequestDto): Promise<NewsItem> {
    const id = uuidv4();
    const item = this.dtoToEntity(data, id);
    const payload = {
      ...item,
      dateTime: item.dateTime.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
    await this.collectionRef.child(id).set(payload);
    return item;
  }

  private dtoToEntity(data: CreateNewsItemRequestDto, id: string): NewsItem {
    const now = moment().toDate();
    return {
      id,
      type: data.type,
      dateTime: moment(data.dateTime).toDate(),
      description: data.description,
      updatedAt: now,
    };
  }

  async findAll(): Promise<NewsItem[]> {
    const snapshot = await this.collectionRef.once('value');
    const data = snapshot.val();
    if (!data || typeof data !== 'object') return [];
    const items = Object.values(data) as Array<
      Omit<NewsItem, 'dateTime' | 'updatedAt'> & {
        dateTime: string;
        updatedAt: string;
      }
    >;
    return items
      .map((e) => ({
        ...e,
        dateTime: moment(e.dateTime).toDate(),
        updatedAt: moment(e.updatedAt).toDate(),
      }))
      .sort((a, b) => moment(b.dateTime).valueOf() - moment(a.dateTime).valueOf());
  }

  async findById(id: string): Promise<NewsItem | null> {
    const snapshot = await this.collectionRef.child(id).once('value');
    const raw = snapshot.val();
    if (!raw) return null;
    const item = raw as Omit<NewsItem, 'dateTime' | 'updatedAt'> & {
      dateTime: string;
      updatedAt: string;
    };
    return {
      ...item,
      dateTime: moment(item.dateTime).toDate(),
      updatedAt: moment(item.updatedAt).toDate(),
    };
  }

  async update(id: string, data: Partial<NewsItem>): Promise<NewsItem | null> {
    const ref = this.collectionRef.child(id);
    const snapshot = await ref.once('value');
    if (!snapshot.exists()) return null;

    const updates: Record<string, unknown> = {
      updatedAt: moment().toDate().toISOString(),
    };
    if (data.type != null) updates.type = data.type;
    if (data.dateTime != null) updates.dateTime = moment(data.dateTime).toISOString();
    if (data.description != null) updates.description = data.description;

    await ref.update(updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const ref = this.collectionRef.child(id);
    await ref.remove();
  }
}
