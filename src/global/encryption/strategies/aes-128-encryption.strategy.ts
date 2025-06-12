import * as crypto from 'crypto';

import { EncryptionService } from '../services';

export class Aes128CbcEncryptionStrategy extends EncryptionService {
  private readonly AES_METHOD = 'aes-128-cbc';

  constructor() {
    super();
  }

  encrypt(text: string, key: string): string | undefined {
    const content = this.pkcs5Pad(text);
    try {
      const cipher = crypto.createCipheriv(this.AES_METHOD, Buffer.from(key), key);
      let encrypted = cipher.update(content);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return encrypted.toString('hex');
    } catch (err) {
      throw new Error('Encryption error:' + err);
    }
  }

  decrypt(text: string, key: string): string {
    if (!key) throw new Error('Encryption key not set in environment');

    const decipher = crypto.createDecipheriv(this.AES_METHOD, Buffer.from(key), key);
    const encryptedText = Buffer.from(text, 'hex');
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  private pkcs5Pad(text: string): string {
    const blocksize = 16;
    const pad = blocksize - (text.length % blocksize);
    return text + pad.toString().repeat(pad);
  }
}
