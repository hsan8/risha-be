import { Injectable, Logger } from '@nestjs/common';
import { PigeonRepository } from '@/pigeon/repositories';
import { DOCUMENTATION_NUMBER_CONSTANTS } from '@/pigeon/constants';
import { VALIDATION_CONSTANTS } from '@/core/constants';
import { Pigeon } from '../entities';

@Injectable()
export class DocumentationNumberService {
  private readonly logger = new Logger(DocumentationNumberService.name);

  constructor(private readonly pigeonRepository: PigeonRepository) {}

  /**
   * Generates a documentation number for a pigeon based on the year of birth.
   * Letter (A, B, C, ...) only advances when the current letter reaches 999.
   */
  async generateDocumentationNo(yearOfBirth: number, userId: string): Promise<string> {
    const pigeons = await this.pigeonRepository.findAllByUserId(userId);
    const yearStr = `${yearOfBirth}`;
    const pigeonsForYear = pigeons.filter((p) => p.yearOfBirth === yearStr);
    const { letter, sequence } = this.getNextLetterAndSequence(pigeonsForYear, yearStr);
    return this.formatDocumentationNo(yearStr, letter, sequence);
  }

  /**
   * Gets the next letter and sequence for the given year.
   * We only move to the next letter (A -> B -> C ...) when the current letter has reached 999.
   */
  private getNextLetterAndSequence(pigeonsForYear: Pigeon[], yearStr: string): { letter: string; sequence: number } {
    const letterToMaxSeq = new Map<string, number>();

    for (const pigeon of pigeonsForYear) {
      const parsed = this.parseDocumentationNo(pigeon.documentationNo);
      if (!parsed || parsed.year !== yearStr) continue;

      const current = letterToMaxSeq.get(parsed.letter) ?? 0;
      letterToMaxSeq.set(parsed.letter, Math.max(current, parsed.sequence));
    }

    if (letterToMaxSeq.size === 0) {
      return { letter: DOCUMENTATION_NUMBER_CONSTANTS.LETTERS[0], sequence: 1 };
    }

    const letters = DOCUMENTATION_NUMBER_CONSTANTS.LETTERS as readonly string[];
    const letterIndexByChar = new Map<string, number>(letters.map((l, i) => [l, i]));
    const usedLetters = [...letterToMaxSeq.keys()].sort(
      (a, b) => (letterIndexByChar.get(a) ?? 0) - (letterIndexByChar.get(b) ?? 0),
    );
    const currentLetter = usedLetters[usedLetters.length - 1] ?? letters[0];
    const maxSeq = letterToMaxSeq.get(currentLetter) ?? 0;

    if (maxSeq >= DOCUMENTATION_NUMBER_CONSTANTS.MAX_SEQUENCE) {
      const currentIndex = letters.indexOf(currentLetter);
      const nextLetter = letters[currentIndex + 1];
      if (!nextLetter) {
        this.logger.warn(`No next letter after ${currentLetter} for year ${yearStr}`);
        return { letter: currentLetter, sequence: maxSeq + 1 };
      }
      return { letter: nextLetter, sequence: 1 };
    }

    return { letter: currentLetter, sequence: maxSeq + 1 };
  }

  /**
   * Formats the documentation number with the given components
   */
  private formatDocumentationNo(yearOfBirth: string, letter: string, sequence: number): string {
    const paddedSequence = sequence.toString().padStart(VALIDATION_CONSTANTS.SEQUENCE_PADDING, '0');
    return `${yearOfBirth}-${letter}-${paddedSequence}`;
  }

  /**
   * Validates if a documentation number follows the correct pattern
   */
  validateDocumentationNo(documentationNo: string): boolean {
    return DOCUMENTATION_NUMBER_CONSTANTS.PATTERN.test(documentationNo);
  }

  /**
   * Extracts components from a documentation number
   */
  parseDocumentationNo(documentationNo: string): { year: string; letter: string; sequence: number } | null {
    const match = documentationNo.match(/^(\d{4})-([A-Za-z])-(\d{3})$/);
    if (!match) {
      return null;
    }

    return {
      year: match[1],
      letter: match[2].toUpperCase(),
      sequence: parseInt(match[3], 10),
    };
  }
}
