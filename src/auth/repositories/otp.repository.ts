import { AUTH_CONSTANTS } from '@/auth/constants';
import { OTP } from '@/auth/entities';
import { OTPType } from '@/auth/enums';
import { FirebaseService } from '@/core/services';
import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export interface CreateOTPData {
  email: string;
  code: string;
  type: OTPType;
  expiresAt: Date;
  used: boolean;
}

@Injectable()
export class OTPRepository {
  private readonly logger = new Logger(OTPRepository.name);
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(AUTH_CONSTANTS.OTP_COLLECTION);
  }

  async create(data: CreateOTPData): Promise<OTP> {
    const id = uuidv4();
    const otpRef = this.collectionRef.child(id);

    const entity = this.dataToEntity(data, id);
    const payload = {
      ...entity,
      expiresAt: entity.expiresAt.toISOString(),
      createdAt: entity.createdAt.toISOString(),
    };
    await otpRef.set(payload);
    return entity;
  }

  private dataToEntity(data: CreateOTPData, id: string): OTP {
    const now = moment().toDate();
    return {
      id,
      email: data.email.toLowerCase(),
      code: data.code,
      type: data.type,
      expiresAt: data.expiresAt,
      used: data.used,
      createdAt: now,
    } as OTP;
  }

  async markAsUsed(id: string): Promise<void> {
    const otpRef = this.collectionRef.child(id);

    await otpRef.update({
      used: true,
      usedAt: moment().toDate(), // Store as ISO string
    });
  }

  async findByEmail(email: string): Promise<OTP[]> {
    const snapshot = await this.collectionRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    if (_.isNil(data) || !_.isPlainObject(data)) {
      return [];
    }

    return Object.entries(data).map(([id, val]) => ({ ...(val as object), id })) as OTP[];
  }

  deleteUsedOTPs(otps: OTP[]): Promise<void[]> {
    const list: OTP[] = Array.isArray(otps) ? otps : (Object.values(otps ?? {}) as OTP[]);
    const deletePromises: Promise<void>[] = [];

    for (const otp of list) {
      if (otp?.id) {
        deletePromises.push(this.collectionRef.child(otp.id).remove());
      }
    }

    return Promise.all(deletePromises);
  }
}
