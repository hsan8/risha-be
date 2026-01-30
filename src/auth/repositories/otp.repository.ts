import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { OTP } from '@/auth/entities';
import { FirebaseService } from '@/core/services';
import { OTPType } from '@/auth/enums';
import { AUTH_CONSTANTS } from '@/auth/constants';
import moment from 'moment';

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
    const otpRef = this.collectionRef.push();
    const id = otpRef.key;

    const now = new Date();
    const otp = {
      id,
      email: data.email.toLowerCase(),
      code: data.code,
      type: data.type,
      expiresAt: data.expiresAt.toISOString(), // Store as ISO string
      used: data.used,
      createdAt: now.toISOString(), // Store as ISO string
    };

    await otpRef.set(otp);

    // Return the OTP with Date objects for the response
    return {
      ...otp,
      expiresAt: data.expiresAt,
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

    return snapshot.val() as OTP[];
  }

  deleteUsedOTPs(otps: OTP[]): Promise<void[]> {
    const deletePromises: Promise<void>[] = [];

    for (const otp of otps) {
      deletePromises.push(this.collectionRef.child(otp.id).remove());
    }

    return Promise.all(deletePromises);
  }
}
