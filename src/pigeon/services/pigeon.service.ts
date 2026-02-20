import { PageOptionsRequestDto } from '@/core/dtos';
import { I18nMessage } from '@/core/utils/i18n-message.util';
import { HistoryEventType } from '@/history/enums';
import { HistoryRepository } from '@/history/repositories';
import { UserStatisticsService } from '@/user/services';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import moment from 'moment';
import { CreatePigeonRequestDto, UpdatePigeonRequestDto } from '../dto/requests';
import { Pigeon } from '../entities';
import { PigeonGender, PigeonStatus } from '../enums';
import { PigeonRepository } from '../repositories';
import { DocumentationNumberService } from './documentation-number.service';

@Injectable()
export class PigeonService {
  private readonly logger = new Logger(PigeonService.name);

  constructor(
    private readonly pigeonRepository: PigeonRepository,
    private readonly documentationNumberService: DocumentationNumberService,
    private readonly userStatisticsService: UserStatisticsService,
    private readonly historyRepository: HistoryRepository,
  ) {}

  async create(createPigeonDto: CreatePigeonRequestDto, userId: string): Promise<Pigeon> {
    try {
      // Check if ring number already exists
      const existingPigeonWithRing = await this.pigeonRepository.findByRingNo(createPigeonDto.ringNo, userId);
      if (existingPigeonWithRing) {
        throw new ConflictException(I18nMessage.error('duplicateRingNumber', { ringNo: createPigeonDto.ringNo }));
      }

      // Check if documentation number already exists
      const existingPigeonWithDoc = await this.pigeonRepository.findByDocumentationNo(
        createPigeonDto.documentationNo,
        userId,
      );
      if (existingPigeonWithDoc) {
        throw new ConflictException(
          I18nMessage.error('duplicateDocumentationNumber', { docNo: createPigeonDto.documentationNo }),
        );
      }

      // Validate documentation number format
      if (!this.documentationNumberService.validateDocumentationNo(createPigeonDto.documentationNo)) {
        throw new BadRequestException(I18nMessage.error('invalidDocumentationNumberFormat'));
      }

      // Validate parent relationships
      await this.validateParentRelationships(createPigeonDto, userId);

      // Generate documentation number if not provided
      if (!createPigeonDto.documentationNo) {
        createPigeonDto.documentationNo = await this.documentationNumberService.generateDocumentationNo(
          parseInt(createPigeonDto.yearOfBirth, 10),
          userId,
        );
      } else {
        // Validate provided documentation number format
        if (!this.documentationNumberService.validateDocumentationNo(createPigeonDto.documentationNo)) {
          throw new BadRequestException(I18nMessage.error('invalidDocumentationNumberFormat'));
        }
      }

      // Set deadAt date if status is DEAD
      if (createPigeonDto.status === PigeonStatus.DEAD && !createPigeonDto.deadAt) {
        createPigeonDto.deadAt = moment().toDate().toISOString();
      }

      const pigeon = await this.pigeonRepository.create(createPigeonDto, userId);

      // Update statistics
      const isAlive = pigeon.status === PigeonStatus.ALIVE;

      await Promise.all([
        this.userStatisticsService.incrementPigeonCount(userId, createPigeonDto.gender, isAlive),
        this.historyRepository.create({
          pigeonId: pigeon.id,
          userId,
          eventType: isAlive ? HistoryEventType.PIGEON_CREATED_MANUALLY : HistoryEventType.PIGEON_DIED,
          eventDate: isAlive ? pigeon.createdAt : moment(createPigeonDto.deadAt).toDate(),
        }),
      ]);

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

  async findAll(pageOptions: PageOptionsRequestDto, userId: string): Promise<{ items: Pigeon[]; total: number }> {
    try {
      this.logger.log('🐦 PigeonService.findAll - Starting with options:', pageOptions);
      const result = await this.pigeonRepository.findAll(pageOptions, userId);
      this.logger.log('🐦 PigeonService.findAll - Repository returned:', {
        itemsCount: result.items.length,
        total: result.total,
      });
      return result;
    } catch (error) {
      this.logger.error('🐦 PigeonService.findAll - Error:', error);
      this.logger.error('Error retrieving pigeons:', error);
      throw error;
    }
  }

  async findAllPigeonsByUserId(userId: string): Promise<Pigeon[]> {
    try {
      return await this.pigeonRepository.findAllByUserId(userId);
    } catch (error) {
      this.logger.error('Error finding all pigeons by user ID:', error);
      throw error;
    }
  }

  async findOne(id: string, userId: string): Promise<Pigeon> {
    try {
      const pigeon = await this.pigeonRepository.findById(id, userId);

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

  async update(id: string, updatePigeonDto: UpdatePigeonRequestDto, userId: string): Promise<Pigeon> {
    try {
      // Check if pigeon exists
      const existingPigeon = await this.pigeonRepository.findById(id, userId);
      if (!existingPigeon) {
        throw new NotFoundException(I18nMessage.error('notFound'));
      }

      // Check if ring number already exists (if being updated)
      if (updatePigeonDto.ringNo && updatePigeonDto.ringNo !== existingPigeon.ringNo) {
        const existingPigeonWithRing = await this.pigeonRepository.findByRingNo(updatePigeonDto.ringNo, userId);
        if (existingPigeonWithRing) {
          throw new ConflictException(I18nMessage.error('duplicateRingNumber', { ringNo: updatePigeonDto.ringNo }));
        }
      }

      // Check if documentation number already exists (if being updated)
      if (updatePigeonDto.documentationNo && updatePigeonDto.documentationNo !== existingPigeon.documentationNo) {
        const existingPigeonWithDoc = await this.pigeonRepository.findByDocumentationNo(
          updatePigeonDto.documentationNo,
          userId,
        );
        if (existingPigeonWithDoc) {
          throw new ConflictException(
            I18nMessage.error('duplicateDocumentationNumber', { docNo: updatePigeonDto.documentationNo }),
          );
        }
      }

      // Validate parent relationships if being updated
      if (updatePigeonDto.fatherId || updatePigeonDto.motherId) {
        await this.validateParentRelationships(
          {
            ...existingPigeon,
            ...updatePigeonDto,
          } as CreatePigeonRequestDto,
          userId,
        );
      }

      // Handle status changes
      if (updatePigeonDto.status) {
        this.handleStatusChange(existingPigeon, updatePigeonDto.status, updatePigeonDto.deadAt);
      }

      // Validate documentation number format if provided
      if (
        updatePigeonDto.documentationNo &&
        !this.documentationNumberService.validateDocumentationNo(updatePigeonDto.documentationNo)
      ) {
        throw new BadRequestException(I18nMessage.error('invalidDocumentationNumberFormat'));
      }

      const updatedPigeon = await this.pigeonRepository.update(
        id,
        updatePigeonDto as unknown as Partial<Pigeon>,
        userId,
      );

      // Update statistics if status changed
      if (updatePigeonDto.status && existingPigeon.status !== updatePigeonDto.status) {
        const fromAlive = existingPigeon.status === PigeonStatus.ALIVE;
        const toAlive = updatedPigeon.status === PigeonStatus.ALIVE;
        await this.userStatisticsService.updatePigeonStatus(userId, fromAlive, toAlive);
      }

      this.logger.log('updated');
      return updatedPigeon;
    } catch (error) {
      this.logger.error(`Error updating pigeon with ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const pigeon = await this.pigeonRepository.findById(id, userId);

      if (!pigeon) {
        throw new NotFoundException(I18nMessage.error('notFound'));
      }

      // Update statistics before deletion
      const wasAlive = pigeon.status === PigeonStatus.ALIVE;
      await this.userStatisticsService.decrementPigeonCount(userId, pigeon.gender, wasAlive);

      await this.pigeonRepository.delete(id, userId);

      this.logger.log('deleted');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Error deleting pigeon with ID ${id}:`, error);

      throw error;
    }
  }

  private async validateParentRelationships(pigeonDto: CreatePigeonRequestDto, userId: string): Promise<void> {
    // Validate father if provided
    if (pigeonDto.fatherId) {
      const father = await this.pigeonRepository.findById(pigeonDto.fatherId, userId);

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
    if (pigeonDto.motherId) {
      const mother = await this.pigeonRepository.findById(pigeonDto.motherId, userId);
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

  private handleStatusChange(existingPigeon: Pigeon, newStatus: PigeonStatus, deadAt?: string): void {
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
