import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { OTP } from '@/auth/entities';
import { FirebaseService } from '@/core/services';
import { OTPType } from '@/auth/enums';
import { AUTH_CONSTANTS, MILLISECONDS_PER_MINUTE } from '@/auth/constants';

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
    const otp = {
      id,
      email: data.email.toLowerCase(),
      code: data.code,
      type: data.type,
      expiresAt: data.expiresAt.toISOString(), // Store as ISO string
      used: data.used,
      attempts: data.attempts,
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

  async findValidOTPByEmail(email: string, code: string): Promise<OTP | null> {
    const snapshot = await this.collectionRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

    if (!snapshot.exists()) {
      return null;
    }

    const otps = snapshot.val();
    const now = new Date();
    let mostRecentValidOTP: OTP | null = null;

    // Find the most recent valid OTP
    for (const otpId of Object.keys(otps)) {
      const otp = otps[otpId] as OTP;

      if (
        otp.code === code &&
        !otp.used &&
        otp.expiresAt && // Check if expiresAt exists
        new Date(otp.expiresAt) > now &&
        otp.attempts < AUTH_CONSTANTS.MAX_OTP_ATTEMPTS
      ) {
        if (
          !mostRecentValidOTP ||
          (otp.createdAt &&
            (!mostRecentValidOTP.createdAt || new Date(otp.createdAt) > new Date(mostRecentValidOTP.createdAt)))
        ) {
          mostRecentValidOTP = otp;
        }
      }
    }

    return mostRecentValidOTP;
  }

  async markAsUsed(id: string): Promise<void> {
    const otpRef = this.collectionRef.child(id);
    await otpRef.update({
      used: true,
      usedAt: new Date().toISOString(), // Store as ISO string
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

  async getLastOTPForEmail(email: string, type: OTPType): Promise<OTP | null> {
    const otps = await this.findByEmail(email, type);
    return otps.length > 0 ? otps[0] : null;
  }

  async countOTPsInLast24Hours(email: string, type: OTPType): Promise<number> {
    const otps = await this.findByEmail(email, type);
    const now = new Date();
    const twentyFourHoursAgo = new Date(
      now.getTime() - AUTH_CONSTANTS.HOURS_PER_DAY * AUTH_CONSTANTS.MINUTES_IN_HOUR * MILLISECONDS_PER_MINUTE,
    );

    return otps.filter((otp) => new Date(otp.createdAt) > twentyFourHoursAgo).length;
  }

  async canSendOTP(email: string, type: OTPType): Promise<{ canSend: boolean; reason?: string }> {
    // Check daily limit
    const dailyCount = await this.countOTPsInLast24Hours(email, type);
    if (dailyCount >= AUTH_CONSTANTS.MAX_OTP_PER_DAY) {
      return { canSend: false, reason: 'daily_limit' };
    }

    // Check cooldown period
    const lastOTP = await this.getLastOTPForEmail(email, type);
    if (lastOTP) {
      const now = new Date();
      const lastSentTime = new Date(lastOTP.createdAt);
      const cooldownEndTime = new Date(
        lastSentTime.getTime() + AUTH_CONSTANTS.OTP_RESEND_COOLDOWN_MINUTES * MILLISECONDS_PER_MINUTE,
      );

      if (now < cooldownEndTime) {
        return { canSend: false, reason: 'cooldown' };
      }
    }

    return { canSend: true };
  }
}
