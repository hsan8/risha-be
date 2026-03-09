import { FirebaseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { ARCHIVED_FORMULA_CONSTANTS } from '../constants';
import { ArchivedFormula } from '../entities';
import { ICreateArchivedFormulaData } from '../interfaces';
import { toFirebaseFormulaSnapshot } from '../utils';

@Injectable()
export class ArchivedFormulaRepository {
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(ARCHIVED_FORMULA_CONSTANTS.COLLECTION_NAME);
  }

  private getUserRef(userId: string): Reference {
    return this.collectionRef.child(userId);
  }

  async create(data: ICreateArchivedFormulaData): Promise<ArchivedFormula> {
    const id = uuidv4();
    const ref = this.getUserRef(data.userId).child(id);

    const payload = this.buildCreatePayload(data, id);
    await ref.set(payload);

    const entity = this.dataToEntity(data, id);
    return entity;
  }

  private buildCreatePayload(data: ICreateArchivedFormulaData, id: string): Record<string, unknown> {
    const now = moment().toDate();
    return {
      id,
      originalFormulaId: data.originalFormulaId,
      userId: data.userId,
      archiveReason: data.archiveReason,
      archivedAt: moment(now).toISOString(),
      formulaSnapshot: toFirebaseFormulaSnapshot(data.formulaSnapshot),
    };
  }

  private dataToEntity(data: ICreateArchivedFormulaData, id: string): ArchivedFormula {
    const now = moment().toDate();
    return {
      id,
      originalFormulaId: data.originalFormulaId,
      userId: data.userId,
      archiveReason: data.archiveReason,
      archivedAt: now,
      formulaSnapshot: data.formulaSnapshot,
    };
  }
}
