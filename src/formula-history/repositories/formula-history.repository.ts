import { FirebaseService } from '@/core/services';
import { BoxNumberUpdateParams, FormulaHistoryEvent } from '@/formula-history/entities';
import { FormulaActions } from '@/formula/enums';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { FORMULA_HISTORY_CONSTANTS } from '../constants';

export interface CreateFormulaHistoryEventData {
  formulaId: string;
  userId: string;
  action: FormulaActions;
  description: string;
  date: Date;
  /** Set when action is BOX_NUMBER_UPDATED */
  params?: BoxNumberUpdateParams;
}

@Injectable()
export class FormulaHistoryRepository {
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(FORMULA_HISTORY_CONSTANTS.COLLECTION_NAME);
  }

  private getFormulaHistoryRef(userId: string, formulaId: string): Reference {
    return this.collectionRef.child(userId).child(formulaId);
  }

  async create(data: CreateFormulaHistoryEventData): Promise<FormulaHistoryEvent> {
    const ref = this.getFormulaHistoryRef(data.userId, data.formulaId);
    const id = uuidv4();
    const entity = this.dataToEntity(data, id);
    const payload = {
      ...entity,
      date: entity.date.toISOString(),
      createdAt: entity.createdAt.toISOString(),
    };
    await ref.child(id).set(payload);
    return entity;
  }

  private dataToEntity(data: CreateFormulaHistoryEventData, id: string): FormulaHistoryEvent {
    const now = moment().toDate();
    return {
      id,
      formulaId: data.formulaId,
      userId: data.userId,
      action: data.action,
      description: data.description,
      date: data.date,
      createdAt: now,
      ...(data.params && { params: data.params }),
    };
  }

  async findByFormulaId(userId: string, formulaId: string): Promise<FormulaHistoryEvent[]> {
    const formulaHistoryRef = this.getFormulaHistoryRef(userId, formulaId);
    const snapshot = await formulaHistoryRef.once('value');
    const data = snapshot.val();
    if (!data || typeof data !== 'object') return [];
    const events = Object.values(data) as Array<
      Omit<FormulaHistoryEvent, 'date' | 'createdAt'> & { date: string; createdAt: string }
    >;
    return events
      .map((e) => ({
        ...e,
        date: moment(e.date).toDate(),
        createdAt: moment(e.createdAt).toDate(),
      }))
      .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());
  }
}
