import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Pigeon } from '../entities';
import { CreatePigeonRequestDto, UpdatePigeonRequestDto } from '../dto/requests';
import { PigeonRepository } from '../repositories';
import { PageOptionsRequestDto } from '@/core/dtos';
import { PigeonStatus, PigeonGender } from '../enums';
import { RegistrationNumberService } from './registration-number.service';
import { I18nMessage } from '@/core/utils/i18n-message.util';

@Injectable()
export class PigeonService {
  private readonly logger = new Logger(PigeonService.name);

  constructor(
    private readonly pigeonRepository: PigeonRepository,
    private readonly registrationNumberService: RegistrationNumberService,
  ) {}

  async create(createPigeonDto: CreatePigeonRequestDto): Promise<Pigeon> {
    try {
      // Check if ring number already exists
      const existingPigeonWithRing = await this.pigeonRepository.findByRingNo(createPigeonDto.ringNo);
      if (existingPigeonWithRing) {
        throw new ConflictException(I18nMessage.error('duplicateRingNumber', { ringNo: createPigeonDto.ringNo }));
      }

      // Check if documentation number already exists
      const existingPigeonWithDoc = await this.pigeonRepository.findByDocumentationNo(createPigeonDto.documentationNo);
      if (existingPigeonWithDoc) {
        throw new ConflictException(
          I18nMessage.error('duplicateDocumentationNumber', { docNo: createPigeonDto.documentationNo }),
        );
      }

      // Validate documentation number format
      if (!this.registrationNumberService.validateRegistrationNumber(createPigeonDto.documentationNo)) {
        throw new BadRequestException(I18nMessage.error('invalidDocumentationNumberFormat'));
      }

      // Validate parent relationships
      await this.validateParentRelationships(createPigeonDto);

      // Generate documentation number if not provided
      if (!createPigeonDto.documentationNo) {
        createPigeonDto.documentationNo = await this.registrationNumberService.generateRegistrationNumber(
          createPigeonDto.yearOfBirth,
        );
      } else {
        // Validate provided documentation number format
        if (!this.registrationNumberService.validateRegistrationNumber(createPigeonDto.documentationNo)) {
          throw new BadRequestException(I18nMessage.error('invalidDocumentationNumberFormat'));
        }
      }

      // Set deadAt date if status is DEAD
      if (createPigeonDto.status === PigeonStatus.DEAD && !createPigeonDto.deadAt) {
        createPigeonDto.deadAt = new Date().toISOString();
      }

      const pigeon = await this.pigeonRepository.create(createPigeonDto);
      this.logger.log(I18nMessage.success('created'));

      return pigeon;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error creating pigeon:', error);
      throw error;
    }
  }

  async findAll(pageOptions: PageOptionsRequestDto): Promise<{ items: Pigeon[]; total: number }> {
    try {
      return await this.pigeonRepository.findAll(pageOptions);
    } catch (error) {
      this.logger.error('Error retrieving pigeons:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Pigeon> {
    try {
      const pigeon = await this.pigeonRepository.findById(id);

      if (!pigeon) {
        throw new NotFoundException(I18nMessage.error('notFound'));
      }

      return pigeon;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error retrieving pigeon with ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, updatePigeonDto: UpdatePigeonRequestDto): Promise<Pigeon> {
    try {
      // Check if pigeon exists
      const existingPigeon = await this.pigeonRepository.findById(id);
      if (!existingPigeon) {
        throw new NotFoundException(I18nMessage.error('notFound'));
      }

      // Check if ring number already exists (if being updated)
      if (updatePigeonDto.ringNo && updatePigeonDto.ringNo !== existingPigeon.ringNo) {
        const existingPigeonWithRing = await this.pigeonRepository.findByRingNo(updatePigeonDto.ringNo);
        if (existingPigeonWithRing) {
          throw new ConflictException(I18nMessage.error('duplicateRingNumber', { ringNo: updatePigeonDto.ringNo }));
        }
      }

      // Check if documentation number already exists (if being updated)
      if (updatePigeonDto.documentationNo && updatePigeonDto.documentationNo !== existingPigeon.documentationNo) {
        const existingPigeonWithDoc = await this.pigeonRepository.findByDocumentationNo(
          updatePigeonDto.documentationNo,
        );
        if (existingPigeonWithDoc) {
          throw new ConflictException(
            I18nMessage.error('duplicateDocumentationNumber', { docNo: updatePigeonDto.documentationNo }),
          );
        }
      }

      // Validate parent relationships if being updated
      if (updatePigeonDto.fatherId || updatePigeonDto.motherId) {
        await this.validateParentRelationships({
          ...existingPigeon,
          ...updatePigeonDto,
        } as CreatePigeonRequestDto);
      }

      // Handle status changes
      if (updatePigeonDto.status) {
        await this.handleStatusChange(existingPigeon, updatePigeonDto.status, updatePigeonDto.deadAt);
      }

      // Validate documentation number format if provided
      if (
        updatePigeonDto.documentationNo &&
        !this.registrationNumberService.validateRegistrationNumber(updatePigeonDto.documentationNo)
      ) {
        throw new BadRequestException(I18nMessage.error('invalidDocumentationNumberFormat'));
      }

      const pigeon = await this.pigeonRepository.update(id, updatePigeonDto);
      this.logger.log(I18nMessage.success('updated'));

      return pigeon;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Error updating pigeon with ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const pigeon = await this.pigeonRepository.findById(id);
      if (!pigeon) {
        throw new NotFoundException(I18nMessage.error('notFound'));
      }

      await this.pigeonRepository.delete(id);
      this.logger.log(I18nMessage.success('deleted'));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting pigeon with ID ${id}:`, error);
      throw error;
    }
  }

  async search(query: string): Promise<Pigeon[]> {
    try {
      return await this.pigeonRepository.search(query);
    } catch (error) {
      this.logger.error('Error searching pigeons:', error);
      throw error;
    }
  }

  async findByRingNo(ringNo: string): Promise<Pigeon | null> {
    try {
      return await this.pigeonRepository.findByRingNo(ringNo);
    } catch (error) {
      this.logger.error(`Error finding pigeon by ring number ${ringNo}:`, error);
      throw error;
    }
  }

  async findByDocumentationNo(documentationNo: string): Promise<Pigeon | null> {
    try {
      return await this.pigeonRepository.findByDocumentationNo(documentationNo);
    } catch (error) {
      this.logger.error(`Error finding pigeon by documentation number ${documentationNo}:`, error);
      throw error;
    }
  }

  async findAlivePigeons(): Promise<Pigeon[]> {
    try {
      return await this.pigeonRepository.findAlivePigeons();
    } catch (error) {
      this.logger.error('Error finding alive pigeons:', error);
      throw error;
    }
  }

  async findAliveParents(): Promise<{ fathers: Pigeon[]; mothers: Pigeon[] }> {
    try {
      return await this.pigeonRepository.findAliveParents();
    } catch (error) {
      this.logger.error('Error finding alive parents:', error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      return await this.pigeonRepository.count();
    } catch (error) {
      this.logger.error('Error counting pigeons:', error);
      throw error;
    }
  }

  async countByStatus(status: PigeonStatus): Promise<number> {
    try {
      return await this.pigeonRepository.countByStatus(status);
    } catch (error) {
      this.logger.error(`Error counting pigeons by status ${status}:`, error);
      throw error;
    }
  }

  async generateRegistrationNumber(yearOfBirth: string): Promise<string> {
    try {
      return await this.registrationNumberService.generateRegistrationNumber(yearOfBirth);
    } catch (error) {
      this.logger.error(`Error generating registration number for year ${yearOfBirth}:`, error);
      throw error;
    }
  }

  private async validateParentRelationships(pigeonDto: CreatePigeonRequestDto): Promise<void> {
    // Validate father if provided
    if (pigeonDto.fatherId) {
      const father = await this.pigeonRepository.findById(pigeonDto.fatherId);
      if (!father) {
        throw new BadRequestException(I18nMessage.error('fatherNotFound', { id: pigeonDto.fatherId }));
      }
      if (father.gender !== PigeonGender.MALE) {
        throw new BadRequestException(I18nMessage.error('notMalePigeon', { id: pigeonDto.fatherId }));
      }
      if (father.status !== PigeonStatus.ALIVE) {
        throw new BadRequestException(I18nMessage.error('fatherNotAlive', { id: pigeonDto.fatherId }));
      }
    }

    // Validate mother if provided
    if (pigeonDto.mother) {
      const mother = await this.pigeonRepository.findById(pigeonDto.mother.id);
      if (!mother) {
        throw new BadRequestException(I18nMessage.error('motherNotFound', { id: pigeonDto.motherId }));
      }
      if (mother.gender !== PigeonGender.FEMALE) {
        throw new BadRequestException(I18nMessage.error('notFemalePigeon', { id: pigeonDto.motherId }));
      }
      if (mother.status !== PigeonStatus.ALIVE) {
        throw new BadRequestException(I18nMessage.error('motherNotAlive', { id: pigeonDto.motherId }));
      }
    }
  }

  private handleStatusChange(existingPigeon: Pigeon, newStatus: PigeonStatus, deadAt?: string): Promise<void> {
    // If changing to DEAD status, set deadAt date
    if (newStatus === PigeonStatus.DEAD && existingPigeon.status !== PigeonStatus.DEAD) {
      if (!deadAt) {
        throw new BadRequestException(I18nMessage.error('deadAtRequired'));
      }
    }

    // If changing from DEAD to another status, clear deadAt date
    if (existingPigeon.status === PigeonStatus.DEAD && newStatus !== PigeonStatus.DEAD) {
      // deadAt will be cleared in the update
    }

    // Validate status transitions
    if (existingPigeon.status === PigeonStatus.DEAD && newStatus !== PigeonStatus.DEAD) {
      throw new BadRequestException(I18nMessage.error('deadPigeonCannotChangeStatus'));
    }

    if (existingPigeon.status === PigeonStatus.SOLD && newStatus === PigeonStatus.ALIVE) {
      throw new BadRequestException(I18nMessage.error('soldPigeonCannotBeAlive'));
    }
  }
}
