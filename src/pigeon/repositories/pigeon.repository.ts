import { PageOptionsRequestDto } from '@/core/dtos';
import { FirebaseService } from '@/core/services';
import { Pigeon } from '@/pigeon/entities';
import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { PIGEON_CONSTANTS } from '../constants';
import { CreatePigeonRequestDto } from '../dto/requests';
import { PigeonGender, PigeonStatus } from '../enums';
import { IVaccinationRecord } from '../interfaces';
import { normalizeRingNo } from '../utils/normalize-ring-no.util';

@Injectable()
export class PigeonRepository {
  private readonly logger = new Logger(PigeonRepository.name);
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(PIGEON_CONSTANTS.COLLECTION_NAME);
  }

  private getUserPigeonsRef(userId: string): Reference {
    return this.db.ref(PIGEON_CONSTANTS.COLLECTION_NAME).child(userId);
  }

  async create(data: CreatePigeonRequestDto, userId: string): Promise<Pigeon> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);

    const id = uuidv4();
    const pigeonRef = userPigeonsRef.child(id);
    const pigeon = this.dtoToEntity(data, id);
    await pigeonRef.set(pigeon);
    return pigeon;
  }

  private dtoToEntity(data: CreatePigeonRequestDto, id: string): Pigeon {
    const now = moment().toDate();
    return {
      id,
      name: data.name,
      gender: data.gender,
      status: data.status || PigeonStatus.ALIVE,
      yearOfRegistration: data.yearOfRegistration,
      letterOfRegistration: data.letterOfRegistration,
      ringNo: normalizeRingNo(data.ringNo),
      ringColor: data.ringColor,
      fatherName: data.fatherName,
      motherName: data.motherName,
      createdAt: now,
      updatedAt: now,
      ...(data.fatherId !== undefined && { fatherId: data.fatherId }),
      ...(data.motherId !== undefined && { motherId: data.motherId }),
      ...(data.ownerId && { ownerId: data.ownerId }),
      ...(data.caseNumber && { caseNumber: data.caseNumber }),
      ...(data.deadAt && { deadAt: moment(data.deadAt).toDate() }),
    };
  }

  async findAll(pageOptions: PageOptionsRequestDto, userId: string): Promise<{ items: Pigeon[]; total: number }> {
    this.logger.log('🐦 PigeonRepository.findAll - Starting database query...');
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    this.logger.log('🐦 Database reference path:', userPigeonsRef.toString());

    try {
      this.logger.log('🐦 Calling userPigeonsRef.once("value")...');
      const snapshot = await userPigeonsRef.once('value');
      this.logger.log('🐦 Database query completed. Snapshot exists:', snapshot.exists());

      const pigeons: Pigeon[] = [];

      snapshot.forEach((childSnapshot) => {
        const pigeon = childSnapshot.val() as Pigeon;
        if (pigeon) {
          pigeons.push(pigeon);
        }
      });

      this.logger.log('🐦 Processing complete. Found', pigeons.length, 'pigeons');

      pigeons.sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf());

      const startIndex = (pageOptions.page - 1) * pageOptions.size;
      const endIndex = startIndex + pageOptions.size;
      const paginatedPigeons = pigeons.slice(startIndex, endIndex);

      return {
        items: paginatedPigeons,
        total: pigeons.length,
      };
    } catch (error) {
      console.error('🐦 PigeonRepository.findAll - Database error:', error);
      throw error;
    }
  }

  async findById(id: string, userId: string): Promise<Pigeon | null> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.child(id).once('value');
    const pigeon = snapshot.val() as Pigeon;

    if (!pigeon) {
      return null;
    }

    return pigeon;
  }

  /**
   * Finds pigeons by exact name and gender for the user.
   * Returns the first match or null. Use when resolving formula parent by name.
   */
  async findByNameAndGender(name: string, gender: PigeonGender, userId: string): Promise<Pigeon[]> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    const pigeons: Pigeon[] = [];
    const nameLower = (name ?? '').trim().toLowerCase();

    if (!nameLower) {
      return pigeons;
    }

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && (pigeon.name ?? '').trim().toLowerCase() === nameLower && pigeon.gender === gender) {
        pigeons.push(pigeon);
      }
    });

    return pigeons;
  }

  async update(id: string, data: Partial<Pigeon>, userId: string): Promise<Pigeon> {
    const userPigeonsRef = this.getUserPigeonsRef(userId).child(id);

    const updatedPigeon: Partial<Pigeon> = {
      ...(data.name != null && data.name !== '' && { name: data.name }),
      ...(data.gender != null && { gender: data.gender }),
      ...(data.status != null && { status: data.status }),
      ...(data.ownerId !== undefined && { ownerId: data.ownerId }),
      ...(data.yearOfRegistration != null && { yearOfRegistration: data.yearOfRegistration }),
      ...(data.letterOfRegistration != null && { letterOfRegistration: data.letterOfRegistration }),
      ...(data.ringNo != null && { ringNo: normalizeRingNo(data.ringNo) }),
      ...(data.ringColor != null && { ringColor: data.ringColor }),
      ...(data.fatherName != null && { fatherName: data.fatherName }),
      ...(data.fatherId !== undefined && { fatherId: data.fatherId }),
      ...(data.motherName != null && { motherName: data.motherName }),
      ...(data.motherId !== undefined && { motherId: data.motherId }),
      ...(data.deadAt != null && { deadAt: moment(data.deadAt).toDate() }),
      ...(data.vaccinationDates != null && {
        vaccinationDates:
          data.vaccinationDates?.map((vaccinationRecord: IVaccinationRecord) => ({
            date: vaccinationRecord.date ?? moment().toDate(),
            vaccine: vaccinationRecord.vaccine ?? '',
            note: vaccinationRecord.note ?? '',
          })) ?? [],
      }),
      updatedAt: moment().toDate(),
    };

    const payload = Object.fromEntries(
      Object.entries(updatedPigeon).filter(([, v]) => v !== undefined),
    ) as Partial<Pigeon>;

    await userPigeonsRef.update(payload);
    return payload as Pigeon;
  }

  async delete(id: string, userId: string): Promise<void> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const pigeonRef = userPigeonsRef.child(id);
    const snapshot = await pigeonRef.once('value');
    const pigeon = snapshot.val() as Pigeon;

    if (!pigeon) {
      throw new Error(`Pigeon with ID ${id} not found`);
    }

    await pigeonRef.remove();
  }

  /** Writes a full pigeon node (e.g. restore from archived snapshot). */
  async restoreFullPigeon(userId: string, pigeon: Pigeon): Promise<void> {
    const ref = this.getUserPigeonsRef(userId).child(pigeon.id);
    const caseNumber = (pigeon as Pigeon & { caseNumber?: string }).caseNumber;
    const payload: Record<string, unknown> = {
      id: pigeon.id,
      name: pigeon.name,
      gender: pigeon.gender,
      status: pigeon.status,
      yearOfRegistration: pigeon.yearOfRegistration,
      letterOfRegistration: pigeon.letterOfRegistration,
      ringNo: normalizeRingNo(pigeon.ringNo),
      ringColor: pigeon.ringColor,
      fatherName: pigeon.fatherName,
      motherName: pigeon.motherName,
      createdAt: moment(pigeon.createdAt).toISOString(),
      updatedAt: moment().toISOString(),
    };
    if (pigeon.fatherId) payload.fatherId = pigeon.fatherId;
    if (pigeon.motherId) payload.motherId = pigeon.motherId;
    if (pigeon.ownerId) payload.ownerId = pigeon.ownerId;
    if (caseNumber) payload.caseNumber = caseNumber;
    if (pigeon.deadAt) payload.deadAt = moment(pigeon.deadAt).toISOString();
    if (pigeon.vaccinationDates?.length) {
      payload.vaccinationDates = pigeon.vaccinationDates.map((r) => ({
        date: moment(r.date).toISOString(),
        vaccine: r.vaccine,
        note: r.note ?? null,
      }));
    }
    await ref.set(payload);
  }

  async search(query: string, userId: string): Promise<Pigeon[]> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    const pigeons: Pigeon[] = [];

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon) {
        const searchFields = [
          pigeon.name,
          pigeon.fatherName,
          pigeon.motherName,
          pigeon.yearOfRegistration,
          pigeon.letterOfRegistration,
          pigeon.ringNo,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (searchFields.includes(query.toLowerCase())) {
          pigeons.push(pigeon);
        }
      }
    });

    return pigeons;
  }

  async findByRingNo(ringNo: string, userId: string): Promise<Pigeon | null> {
    const normalized = normalizeRingNo(ringNo);
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    let foundPigeon: Pigeon | null = null;

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && normalizeRingNo(pigeon.ringNo) === normalized) {
        foundPigeon = pigeon;
        return true;
      }
    });

    return foundPigeon;
  }

  /** Ring number is unique per user per yearOfRegistration. ١٢٣ and 123 are treated as the same. */
  async findByRingNoAndYearOfRegistration(
    ringNo: string,
    yearOfRegistration: string,
    userId: string,
  ): Promise<Pigeon | null> {
    const normalized = normalizeRingNo(ringNo);
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    let foundPigeon: Pigeon | null = null;

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (
        pigeon &&
        normalizeRingNo(pigeon.ringNo) === normalized &&
        pigeon.yearOfRegistration === yearOfRegistration
      ) {
        foundPigeon = pigeon;
        return true;
      }
    });

    return foundPigeon;
  }

  async findByYearOfRegistrationAndLetter(
    yearOfRegistration: string,
    letterOfRegistration: string,
    userId: string,
  ): Promise<Pigeon | null> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    let foundPigeon: Pigeon | null = null;
    const letter = (letterOfRegistration ?? '').trim().toUpperCase();

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (
        pigeon &&
        pigeon.yearOfRegistration === yearOfRegistration &&
        (pigeon.letterOfRegistration ?? '').trim().toUpperCase() === letter
      ) {
        foundPigeon = pigeon;
        return true;
      }
    });

    return foundPigeon;
  }

  async findAllByUserId(userId: string): Promise<Pigeon[]> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');

    const data = snapshot.val();
    if (!snapshot.exists() || _.isNil(data) || !_.isPlainObject(data)) {
      return [];
    }

    return _.compact(_.values(data)) as Pigeon[];
  }

  /** Pigeons where fatherId or motherId equals the given parent pigeon id. */
  async findByParentId(userId: string, parentPigeonId: string): Promise<Pigeon[]> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    const pigeons: Pigeon[] = [];

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && (pigeon.fatherId === parentPigeonId || pigeon.motherId === parentPigeonId)) {
        pigeons.push(pigeon);
      }
    });

    return pigeons;
  }

  async countByStatus(status: PigeonStatus, userId: string): Promise<number> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    let count = 0;

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && pigeon.status === status) {
        count++;
      }
    });

    return count;
  }

  async countByGenderAndStatus(
    userId: string,
  ): Promise<{ maleCount: number; femaleCount: number; totalCount: number }> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    let maleCount = 0;
    let femaleCount = 0;

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && pigeon.status === PigeonStatus.ALIVE) {
        if (pigeon.gender === PigeonGender.MALE) {
          maleCount++;
        } else if (pigeon.gender === PigeonGender.FEMALE) {
          femaleCount++;
        }
      }
    });

    return {
      maleCount,
      femaleCount,
      totalCount: maleCount + femaleCount,
    };
  }
}
