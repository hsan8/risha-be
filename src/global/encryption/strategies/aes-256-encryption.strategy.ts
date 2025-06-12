// class that implement abstract encryption service
import { Inject } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';
import { EncryptionService } from '../services';

export class Aes256CbcEncryptionStrategy extends EncryptionService {
  private iv: string;
  private encKey: string;
  constructor(@Inject('ENCRYPTION_KEY') private readonly ENCRYPTION_KEY: string) {
    super();
    // key for AES encryption must be 32 bytes
    this.encKey = ENCRYPTION_KEY.padEnd(32, '0');
    // iv for AES encryption must be 16 bytes
    this.iv = ENCRYPTION_KEY.padEnd(16, '0');
  }
  encrypt(text: string): string {
    const cipher = createCipheriv('aes-256-cbc', this.encKey, this.iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  }
  decrypt(encryptedText: string): string {
    const decipher = createDecipheriv('aes-256-cbc', this.encKey, this.iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
