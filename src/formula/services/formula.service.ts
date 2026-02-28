import { I18nMessage } from '@/core/utils/i18n-message.util';
import { FormulaHistoryService } from '@/formula-history/services';
import { PigeonGender, PigeonStatus } from '@/pigeon/enums';
import { PigeonRepository } from '@/pigeon/repositories';
import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { FORMULA_MESSAGES } from '../constants';
import { CreateFormulaRequestDto } from '../dto';
import { Formula } from '../entities';
import { FormulaActions, FormulaStatus } from '../enums';
import { FormulaRepository } from '../repositories';

const MAX_EGGS_PER_FORMULA = 2;

@Injectable()
export class FormulaService {
  private readonly logger = new Logger(FormulaService.name);

  constructor(
    private readonly formulaRepository: FormulaRepository,
    @Inject(forwardRef(() => FormulaHistoryService)) private readonly formulaHistoryService: FormulaHistoryService,
    private readonly pigeonRepository: PigeonRepository,
  ) {}

  async createFormula(createFormulaDto: CreateFormulaRequestDto, userId: string): Promise<Formula> {
    this.logger.log('Creating new formula');

    this.normalizeParentIds(createFormulaDto);
    this.ensureBothParentsSpecified(createFormulaDto);
    await this.resolveParentsByName(createFormulaDto, userId);
    this.ensureBothParents(createFormulaDto);
    await this.validateAndEnrichParentPigeons(createFormulaDto, userId);

    const formula = await this.formulaRepository.create(createFormulaDto, userId);
    await this.formulaHistoryService.create({
      formulaId: formula.id,
      userId,
      action: FormulaActions.FORMULA_INITIATED,
      description: 'Formula has been created',
      date: moment(formula.createdAt).toDate(),
    });
    return formula;
  }

  /** Map maleId/femaleId to father/mother when client sends IDs only. */
  private normalizeParentIds(dto: CreateFormulaRequestDto): void {
    if (dto.maleId && !dto.father) {
      dto.father = { id: dto.maleId };
    }
    if (dto.femaleId && !dto.mother) {
      dto.mother = { id: dto.femaleId };
    }
  }

  /** Requires each parent to have at least id or name. */
  private ensureBothParentsSpecified(dto: CreateFormulaRequestDto): void {
    const hasFather = dto.father && (dto.father.id || (dto.father.name && dto.father.name.trim()));
    const hasMother = dto.mother && (dto.mother.id || (dto.mother.name && dto.mother.name.trim()));
    if (!hasFather || !hasMother) {
      throw new BadRequestException(I18nMessage.error('formulaRequiresBothParents', {}));
    }
  }

  /** Resolves father/mother id from name when only name is provided. */
  private async resolveParentsByName(dto: CreateFormulaRequestDto, userId: string): Promise<void> {
    if (dto.father?.name && !dto.father.id) {
      const males = await this.pigeonRepository.findByNameAndGender(
        dto.father.name.trim(),
        PigeonGender.MALE,
        userId,
      );
      if (males.length === 0) {
        throw new BadRequestException(I18nMessage.error('fatherNotFoundByName', { name: dto.father.name.trim() }));
      }
      if (males.length > 1) {
        throw new BadRequestException(I18nMessage.error('multipleMalesNamed', { name: dto.father.name.trim() }));
      }
      dto.father.id = males[0].id;
      dto.father.name = dto.father.name ?? males[0].name;
    }
    if (dto.mother?.name && !dto.mother.id) {
      const females = await this.pigeonRepository.findByNameAndGender(
        dto.mother.name.trim(),
        PigeonGender.FEMALE,
        userId,
      );
      if (females.length === 0) {
        throw new BadRequestException(I18nMessage.error('motherNotFoundByName', { name: dto.mother.name.trim() }));
      }
      if (females.length > 1) {
        throw new BadRequestException(I18nMessage.error('multipleFemalesNamed', { name: dto.mother.name.trim() }));
      }
      dto.mother.id = females[0].id;
      dto.mother.name = dto.mother.name ?? females[0].name;
    }
  }

  private ensureBothParents(dto: CreateFormulaRequestDto): void {
    if (!dto.father?.id || !dto.mother?.id) {
      throw new BadRequestException(I18nMessage.error('formulaRequiresBothParents', {}));
    }
  }

  private async validateAndEnrichParentPigeons(
    createFormulaDto: CreateFormulaRequestDto,
    userId: string,
  ): Promise<void> {
    const father = await this.pigeonRepository.findById(createFormulaDto.father!.id, userId);
    if (!father) {
      throw new BadRequestException(I18nMessage.error('fatherNotFound', { id: createFormulaDto.father!.id }));
    }
    if (father.gender !== PigeonGender.MALE) {
      throw new BadRequestException(I18nMessage.error('fatherMustBeMale', { id: createFormulaDto.father!.id }));
    }
    if (father.status !== PigeonStatus.ALIVE) {
      throw new BadRequestException(I18nMessage.error('fatherMustBeAlive', { id: createFormulaDto.father!.id }));
    }
    createFormulaDto.father!.name = createFormulaDto.father!.name ?? father.name;

    const mother = await this.pigeonRepository.findById(createFormulaDto.mother!.id, userId);
    if (!mother) {
      throw new BadRequestException(I18nMessage.error('motherNotFound', { id: createFormulaDto.mother!.id }));
    }
    if (mother.gender !== PigeonGender.FEMALE) {
      throw new BadRequestException(I18nMessage.error('motherMustBeFemale', { id: createFormulaDto.mother!.id }));
    }
    if (mother.status !== PigeonStatus.ALIVE) {
      throw new BadRequestException(I18nMessage.error('motherMustBeAlive', { id: createFormulaDto.mother!.id }));
    }
    createFormulaDto.mother!.name = createFormulaDto.mother!.name ?? mother.name;
  }

  async getFormulas(userId: string): Promise<Formula[]> {
    this.logger.log('Getting all formulas');
    return await this.formulaRepository.findAll(userId);
  }

  async getFormulaById(formulaId: string, userId: string): Promise<Formula> {
    this.logger.log(`Getting formula with ID: ${formulaId}`);
    const formula = await this.formulaRepository.findById(formulaId, userId);

    if (!formula) {
      throw new NotFoundException(FORMULA_MESSAGES.NOT_FOUND);
    }

    return formula;
  }

  async addEgg(formulaId: string, userId: string): Promise<Formula> {
    this.logger.log(`Adding egg to formula with ID: ${formulaId}`);
    const formula = await this.getFormulaById(formulaId, userId);
    if (formula.eggs.length >= MAX_EGGS_PER_FORMULA) {
      throw new BadRequestException(`Formula already has maximum number of eggs (${MAX_EGGS_PER_FORMULA})`);
    }

    const egg = {
      id: uuidv4(),
      deliveredAt: moment().toDate(),
    };

    formula.eggs.push(egg);
    formula.status = formula.eggs.length === 1 ? FormulaStatus.HAS_ONE_EGG : FormulaStatus.HAS_TWO_EGG;
    const date = moment().toDate();
    await this.formulaHistoryService.create({
      formulaId,
      userId,
      action: formula.eggs.length === 1 ? FormulaActions.FIRST_EGG_DELIVERED : FormulaActions.SECOND_EGG_DELIVERED,
      description: `Egg ${formula.eggs.length} has been delivered`,
      date,
    });

    return this.formulaRepository.update(formulaId, formula, userId);
  }

  async transformEggToPigeon(formulaId: string, eggId: string, pigeonId: string, userId: string): Promise<Formula> {
    this.logger.log(`Transforming egg ${eggId} to pigeon ${pigeonId} in formula ${formulaId}`);
    const formula = await this.getFormulaById(formulaId, userId);

    const eggIndex = formula.eggs.findIndex((egg) => egg.id === eggId);
    if (eggIndex === -1) {
      throw new NotFoundException('Egg not found in formula');
    }

    if (formula.eggs[eggIndex].transformedToPigeonAt || formula.eggs[eggIndex].pigeonId) {
      throw new BadRequestException('Egg already transformed to pigeon');
    }

    formula.eggs[eggIndex].transformedToPigeonAt = moment().toDate();
    formula.eggs[eggIndex].pigeonId = pigeonId;
    formula.children.push(pigeonId);

    const isFirstEgg = eggIndex === 0;
    formula.status = formula.children.length === 1 ? FormulaStatus.HAS_ONE_PIGEON : FormulaStatus.HAS_TWO_PIGEON;
    const date = moment().toDate();
    const action = isFirstEgg
      ? FormulaActions.FIRST_EGG_TRANSFORMED_TO_FRESH_PIGEON
      : FormulaActions.SECOND_EGG_TRANSFORMED_TO_FRESH_PIGEON;
    const description = `Egg ${eggIndex + 1} has been transformed to pigeon with ID: ${pigeonId}`;
    await this.formulaHistoryService.create({ formulaId, userId, action, description, date });

    return this.formulaRepository.update(formulaId, formula, userId);
  }

  async terminateFormula(formulaId: string, reason: string, userId: string): Promise<Formula> {
    this.logger.log(`Terminating formula with ID: ${formulaId}`);
    const formula = await this.getFormulaById(formulaId, userId);

    if (formula.status === FormulaStatus.TERMINATED) {
      throw new BadRequestException('Formula is already terminated');
    }

    formula.status = FormulaStatus.TERMINATED;
    const date = moment().toDate();
    await this.formulaHistoryService.create({
      formulaId,
      userId,
      action: FormulaActions.FORMULA_GOT_TERMINATED,
      description: reason,
      date,
    });

    return this.formulaRepository.update(formulaId, formula, userId);
  }

  async searchFormulas(query: string, userId: string): Promise<Formula[]> {
    this.logger.log(`Searching formulas with query: ${query}`);
    return await this.formulaRepository.search(query, userId);
  }

  async getFormulaCount(userId: string): Promise<number> {
    return await this.formulaRepository.count(userId);
  }

  async getFormulaCountByStatus(status: FormulaStatus, userId: string): Promise<number> {
    return await this.formulaRepository.countByStatus(status, userId);
  }

  updateFormulaStatus(formula: Formula, newStatus: FormulaStatus): Formula {
    formula.status = newStatus;
    formula.updatedAt = moment().toDate();
    // TODO: Save to database
    return formula;
  }

  addHistoryEntry(formula: Formula, action: FormulaActions, description: string): Formula {
    formula.updatedAt = moment().toDate();
    // Use formulaHistoryService.create() when persisting formula history
    return formula;
  }
}
