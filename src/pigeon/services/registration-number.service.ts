import { Injectable, Logger } from '@nestjs/common';
import { PigeonRepository } from '../repositories/pigeon.repository';
import { REGISTRATION_NUMBER_CONSTANTS } from '../constants/pigeon.constants';
import { VALIDATION_CONSTANTS } from '@/core/constants/validation.constant';

@Injectable()
export class RegistrationNumberService {
  private readonly logger = new Logger(RegistrationNumberService.name);

  constructor(private readonly pigeonRepository: PigeonRepository) {}

  /**
   * Generates a registration number for a pigeon based on the year of birth
   */
  async generateRegistrationNumber(yearOfBirth: string): Promise<string> {
    const letter = this.getNextLetter();
    const sequence = await this.getNextSequence();
    return this.formatRegistrationNumber(yearOfBirth, letter, sequence);
  }

  /**
   * Gets the next available letter for registration number
   */
  private getNextLetter(): string {
    // For now, just return 'A'. In the future, this will be based on the last used letter
    return REGISTRATION_NUMBER_CONSTANTS.LETTERS[0];
  }

  /**
   * Gets the next available sequence number
   */
  private getNextSequence(): number {
    // For now, just return 1. In the future, this will be based on the last used sequence
    return 1;
  }

  /**
   * Formats the registration number with the given components
   */
  private formatRegistrationNumber(yearOfBirth: string, letter: string, sequence: number): string {
    const paddedSequence = sequence.toString().padStart(VALIDATION_CONSTANTS.SEQUENCE_PADDING, '0');
    return `${yearOfBirth}-${letter}-${paddedSequence}`;
  }

  /**
   * Validates if a registration number follows the correct pattern
   */
  validateRegistrationNumber(registrationNumber: string): boolean {
    return REGISTRATION_NUMBER_CONSTANTS.PATTERN.test(registrationNumber);
  }

  /**
   * Extracts components from a registration number
   */
  parseRegistrationNumber(registrationNumber: string): { year: string; letter: string; sequence: number } | null {
    const match = registrationNumber.match(/^(\d{4})-([A-Z])-(\d{3})$/);
    if (!match) {
      return null;
    }

    return {
      year: match[1],
      letter: match[2],
      sequence: parseInt(match[3], 10),
    };
  }
}
