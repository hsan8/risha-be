import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { Pigeon } from '@/pigeon/entities';
import { CreatePigeonRequestDto, UpdatePigeonRequestDto } from '../dto/requests';
import { FirebaseService } from '@/core/services';
import { PigeonStatus, PigeonGender } from '../enums';
import { PIGEON_CONSTANTS } from '../constants';
import { PageOptionsRequestDto } from '@/core/dtos';

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
    return this.db.ref(`users/${userId}/pigeons`);
  }

  async create(data: CreatePigeonRequestDto, userId: string): Promise<Pigeon> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const pigeonRef = userPigeonsRef.push();
    const id = pigeonRef.key;

    const now = new Date();
    const pigeon: Pigeon = {
      id,
      name: data.name,
      gender: data.gender,
      status: data.status || PigeonStatus.ALIVE,
      documentationNo: data.documentationNo,
      ringNo: data.ringNo,
      ringColor: data.ringColor,
      fatherName: data.fatherName,
      motherName: data.motherName,
      yearOfBirth: data.yearOfBirth,
      createdAt: now,
      updatedAt: now,
      ...(data.ownerId && { ownerId: data.ownerId }),
      ...(data.caseNumber && { caseNumber: data.caseNumber }),
      ...(data.deadAt && { deadAt: new Date(data.deadAt) }),
    };

    await pigeonRef.set(pigeon);
    return pigeon;
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

      pigeons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  async update(id: string, data: UpdatePigeonRequestDto, userId: string): Promise<Pigeon> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const pigeonRef = userPigeonsRef.child(id);
    const snapshot = await pigeonRef.once('value');
    const existingPigeon = snapshot.val() as Pigeon;

    if (!existingPigeon) {
      throw new Error(`Pigeon with ID ${id} not found`);
    }

    const updatedPigeon: Pigeon = {
      ...existingPigeon,
      ...(data.name && { name: data.name }),
      ...(data.gender && { gender: data.gender }),
      ...(data.status && { status: data.status }),
      ...(data.ownerId !== undefined && { ownerId: data.ownerId }),
      ...(data.documentationNo && { documentationNo: data.documentationNo }),
      ...(data.ringNo && { ringNo: data.ringNo }),
      ...(data.ringColor && { ringColor: data.ringColor }),
      ...(data.caseNumber !== undefined && { caseNumber: data.caseNumber }),
      ...(data.fatherName && { fatherName: data.fatherName }),
      ...(data.motherName && { motherName: data.motherName }),
      ...(data.yearOfBirth && { yearOfBirth: data.yearOfBirth }),
      ...(data.deadAt && { deadAt: new Date(data.deadAt) }),
      updatedAt: new Date(),
    };

    await pigeonRef.update(updatedPigeon);
    return updatedPigeon;
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
          pigeon.documentationNo,
          pigeon.ringNo,
          pigeon.caseNumber,
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
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    let foundPigeon: Pigeon | null = null;

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && pigeon.ringNo === ringNo) {
        foundPigeon = pigeon;
        return true;
      }
    });

    return foundPigeon;
  }

  async findByDocumentationNo(documentationNo: string, userId: string): Promise<Pigeon | null> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    let foundPigeon: Pigeon | null = null;

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && pigeon.documentationNo === documentationNo) {
        foundPigeon = pigeon;
        return true;
      }
    });

    return foundPigeon;
  }

  async findByYearOfBirth(yearOfBirth: string): Promise<Pigeon[]> {
    const snapshot = await this.collectionRef.once('value');
    const pigeons: Pigeon[] = [];

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && pigeon.yearOfBirth === yearOfBirth) {
        pigeons.push(pigeon);
      }
    });

    return pigeons;
  }

  async findAlivePigeons(userId: string): Promise<Pigeon[]> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    const pigeons: Pigeon[] = [];

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && pigeon.status === PigeonStatus.ALIVE) {
        pigeons.push(pigeon);
      }
    });

    return pigeons;
  }

  async findAliveParents(userId: string): Promise<{ fathers: Pigeon[]; mothers: Pigeon[] }> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    const fathers: Pigeon[] = [];
    const mothers: Pigeon[] = [];

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon && pigeon.status === PigeonStatus.ALIVE) {
        if (pigeon.gender === PigeonGender.MALE) {
          fathers.push(pigeon);
        } else if (pigeon.gender === PigeonGender.FEMALE) {
          mothers.push(pigeon);
        }
      }
    });

    return { fathers, mothers };
  }

  async count(userId: string): Promise<number> {
    const userPigeonsRef = this.getUserPigeonsRef(userId);
    const snapshot = await userPigeonsRef.once('value');
    let count = 0;

    snapshot.forEach((childSnapshot) => {
      const pigeon = childSnapshot.val() as Pigeon;
      if (pigeon) {
        count++;
      }
    });

    return count;
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
