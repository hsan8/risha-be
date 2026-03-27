import { FirebaseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { ARCHIVED_FORMULA_CONSTANTS } from '../constants';
import { ArchivedFormula } from '../entities';
import { ICreateArchivedFormulaData } from '../interfaces';
import { fromFirebaseFormulaSnapshot, toFirebaseFormulaSnapshot } from '../utils';

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

  async findAllByUserId(userId: string): Promise<ArchivedFormula[]> {
    const snapshot = await this.getUserRef(userId).once('value');
    const data = snapshot.val();
    if (!snapshot.exists() || _.isNil(data) || !_.isPlainObject(data)) return [];

    const list = _.values(data).map((row) => this.rawToArchivedFormula(row as Record<string, unknown>));
    list.sort((a, b) => moment(b.archivedAt).valueOf() - moment(a.archivedAt).valueOf());
    return list;
  }

  private rawToArchivedFormula(raw: Record<string, unknown>): ArchivedFormula {
    const formulaSnapshotRaw = raw.formulaSnapshot;
    const formulaSnapshot =
      formulaSnapshotRaw != null && _.isPlainObject(formulaSnapshotRaw)
        ? fromFirebaseFormulaSnapshot(formulaSnapshotRaw as Record<string, unknown>)
        : (formulaSnapshotRaw as ArchivedFormula['formulaSnapshot']);

    return {
      id: raw.id as string,
      originalFormulaId: raw.originalFormulaId as string,
      userId: raw.userId as string,
      archiveReason: raw.archiveReason as string,
      archivedAt: moment(raw.archivedAt as string).toDate(),
      formulaSnapshot,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    const ref = this.getUserRef(userId).child(id);
    const snapshot = await ref.once('value');
    if (!snapshot.exists()) return;
    await ref.remove();
  }

  async findById(id: string, userId: string): Promise<ArchivedFormula | null> {
    const ref = this.getUserRef(userId).child(id);
    const snapshot = await ref.once('value');
    if (!snapshot.exists()) return null;
    return this.rawToArchivedFormula(snapshot.val() as Record<string, unknown>);
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
