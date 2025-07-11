import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { OTP } from '../entities/otp.entity';
import { FirebaseService } from '@/core/services/firebase.service';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { OTPType } from '../enums/auth.enum';

export interface CreateOTPData {
  email: string;
  code: string;
  type: OTPType;
  expiresAt: Date;
  used: boolean;
  attempts: number;
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
    const otp: OTP = {
      id,
      email: data.email.toLowerCase(),
      code: data.code,
      type: data.type,
      expiresAt: data.expiresAt,
      used: data.used,
      attempts: data.attempts,
      createdAt: now,
    };

    await otpRef.set(otp);
    return otp;
  }

  async findValidOTP(email: string, code: string, type: OTPType): Promise<OTP | null> {
    const snapshot = await this.collectionRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

    if (!snapshot.exists()) {
      return null;
    }

    const otps = snapshot.val();
    const now = new Date();

    // Find the most recent valid OTP
    for (const otpId of Object.keys(otps)) {
      const otp = otps[otpId] as OTP;

      if (
        otp.code === code &&
        otp.type === type &&
        !otp.used &&
        new Date(otp.expiresAt) > now &&
        otp.attempts < AUTH_CONSTANTS.MAX_OTP_ATTEMPTS
      ) {
        return otp;
      }
    }

    return null;
  }

  async markAsUsed(id: string): Promise<void> {
    const otpRef = this.collectionRef.child(id);
    await otpRef.update({
      used: true,
      usedAt: new Date(),
    });
  }

  async incrementAttempts(id: string): Promise<void> {
    const otpRef = this.collectionRef.child(id);
    const snapshot = await otpRef.once('value');
    const otp = snapshot.val() as OTP;

    if (otp) {
      await otpRef.update({
        attempts: otp.attempts + 1,
      });
    }
  }

  async findByEmail(email: string, type: OTPType): Promise<OTP[]> {
    const snapshot = await this.collectionRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

    if (!snapshot.exists()) {
      return [];
    }

    const otps = snapshot.val();
    const result: OTP[] = [];

    for (const otpId of Object.keys(otps)) {
      const otp = otps[otpId] as OTP;
      if (otp.type === type) {
        result.push(otp);
      }
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async deleteExpiredOTPs(): Promise<void> {
    const snapshot = await this.collectionRef.once('value');
    const now = new Date();

    if (!snapshot.exists()) {
      return;
    }

    const otps = snapshot.val();
    const deletePromises: Promise<void>[] = [];

    for (const otpId of Object.keys(otps)) {
      const otp = otps[otpId] as OTP;

      if (new Date(otp.expiresAt) <= now) {
        deletePromises.push(this.collectionRef.child(otpId).remove());
      }
    }

    await Promise.all(deletePromises);
    this.logger.log(`Deleted ${deletePromises.length} expired OTPs`);
  }

  async deleteUsedOTPs(): Promise<void> {
    const snapshot = await this.collectionRef.once('value');

    if (!snapshot.exists()) {
      return;
    }

    const otps = snapshot.val();
    const deletePromises: Promise<void>[] = [];

    for (const otpId of Object.keys(otps)) {
      const otp = otps[otpId] as OTP;

      if (otp.used) {
        deletePromises.push(this.collectionRef.child(otpId).remove());
      }
    }

    await Promise.all(deletePromises);
    this.logger.log(`Deleted ${deletePromises.length} used OTPs`);
  }
}
