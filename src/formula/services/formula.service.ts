import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Formula } from '../entities';
import { CreateFormulaRequestDto } from '../dto';
import { FormulaActions, FormulaStatus } from '../enums';
import { FormulaRepository } from '../repositories';
import { FORMULA_MESSAGES } from '../constants';
import { PageOptionsRequestDto } from '@/core/dtos';
import { v4 as uuidv4 } from 'uuid';
import { PigeonRepository } from '@/pigeon/repositories';
import { PigeonGender, PigeonStatus } from '@/pigeon/enums';
import { I18nMessage } from '@/core/utils/i18n-message.util';

const MAX_EGGS_PER_FORMULA = 2;

@Injectable()
export class FormulaService {
  private readonly logger = new Logger(FormulaService.name);

  constructor(
    private readonly formulaRepository: FormulaRepository,
    private readonly pigeonRepository: PigeonRepository,
  ) {}

  async createFormula(createFormulaDto: CreateFormulaRequestDto, userId: string): Promise<Formula> {
    this.logger.log('Creating new formula');

    // Validate parent pigeons
    await this.validateParentPigeons(createFormulaDto, userId);

    const formula = await this.formulaRepository.create(createFormulaDto, userId);
    return formula;
  }

  private async validateParentPigeons(createFormulaDto: CreateFormulaRequestDto, userId: string): Promise<void> {
    // Validate father
    if (createFormulaDto.father?.id) {
      const father = await this.pigeonRepository.findById(createFormulaDto.father.id, userId);
      if (!father) {
        throw new BadRequestException(I18nMessage.error('fatherNotFound', { id: createFormulaDto.father.id }));
      }
      if (father.gender !== PigeonGender.MALE) {
        throw new BadRequestException(I18nMessage.error('fatherMustBeMale', { id: createFormulaDto.father.id }));
      }
      if (father.status !== PigeonStatus.ALIVE) {
        throw new BadRequestException(I18nMessage.error('fatherMustBeAlive', { id: createFormulaDto.father.id }));
      }
    }

    // Validate mother
    if (createFormulaDto.mother?.id) {
      const mother = await this.pigeonRepository.findById(createFormulaDto.mother.id, userId);
      if (!mother) {
        throw new BadRequestException(I18nMessage.error('motherNotFound', { id: createFormulaDto.mother.id }));
      }
      if (mother.gender !== PigeonGender.FEMALE) {
        throw new BadRequestException(I18nMessage.error('motherMustBeFemale', { id: createFormulaDto.mother.id }));
      }
      if (mother.status !== PigeonStatus.ALIVE) {
        throw new BadRequestException(I18nMessage.error('motherMustBeAlive', { id: createFormulaDto.mother.id }));
      }
    }
  }

  async getFormulas(pageOptions: PageOptionsRequestDto, userId: string): Promise<{ items: Formula[]; total: number }> {
    this.logger.log('Getting all formulas');
    return await this.formulaRepository.findAll(pageOptions, userId);
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
      deliveredAt: new Date(),
    };

    formula.eggs.push(egg);
    formula.status = formula.eggs.length === 1 ? FormulaStatus.HAS_ONE_EGG : FormulaStatus.HAS_TWO_EGG;
    formula.history.push({
      action: formula.eggs.length === 1 ? FormulaActions.FIRST_EGG_DELIVERED : FormulaActions.SECOND_EGG_DELIVERED,
      description: `Egg ${formula.eggs.length} has been delivered`,
      date: new Date(),
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

    formula.eggs[eggIndex].transformedToPigeonAt = new Date();
    formula.eggs[eggIndex].pigeonId = pigeonId;
    formula.children.push(pigeonId);

    const isFirstEgg = eggIndex === 0;
    formula.status = formula.children.length === 1 ? FormulaStatus.HAS_ONE_PIGEON : FormulaStatus.HAS_TWO_PIGEON;
    formula.history.push({
      action: isFirstEgg
        ? FormulaActions.FIRST_EGG_TRANSFORMED_TO_FRESH_PIGEON
        : FormulaActions.SECOND_EGG_TRANSFORMED_TO_FRESH_PIGEON,
      description: `Egg ${eggIndex + 1} has been transformed to pigeon with ID: ${pigeonId}`,
      date: new Date(),
    });

    return this.formulaRepository.update(formulaId, formula, userId);
  }

  async terminateFormula(formulaId: string, reason: string, userId: string): Promise<Formula> {
    this.logger.log(`Terminating formula with ID: ${formulaId}`);
    const formula = await this.getFormulaById(formulaId, userId);

    if (formula.status === FormulaStatus.TERMINATED) {
      throw new BadRequestException('Formula is already terminated');
    }

    formula.status = FormulaStatus.TERMINATED;
    formula.history.push({
      action: FormulaActions.FORMULA_GOT_TERMINATED,
      description: reason,
      date: new Date(),
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
    formula.updatedAt = new Date();
    // TODO: Save to database
    return formula;
  }

  addHistoryEntry(formula: Formula, action: FormulaActions, description: string): Formula {
    formula.history.push({
      action,
      description,
      date: new Date(),
    });
    formula.updatedAt = new Date();
    // TODO: Save to database
    return formula;
  }
}
