export abstract class EncryptionService {
  abstract encrypt(text: string, key?: string): string;
  abstract decrypt(text: string, key?: string): string;
}
