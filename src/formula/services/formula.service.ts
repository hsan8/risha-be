import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Formula } from '../entities';
import { CreateFormulaRequestDto } from '../dto';
import { FormulaActions, FormulaStatus } from '../enums';
import { FormulaRepository } from '../repositories';
import { FORMULA_MESSAGES } from '../constants';
import { PageOptionsRequestDto } from '@/core/dtos';
import { v4 as uuidv4 } from 'uuid';

const MAX_EGGS_PER_FORMULA = 2;

@Injectable()
export class FormulaService {
  private readonly logger = new Logger(FormulaService.name);

  constructor(private readonly formulaRepository: FormulaRepository) {}

  async createFormula(createFormulaDto: CreateFormulaRequestDto): Promise<Formula> {
    this.logger.log('Creating new formula');
    const formula = await this.formulaRepository.create(createFormulaDto);
    return formula;
  }

  async getFormulas(pageOptions: PageOptionsRequestDto): Promise<{ items: Formula[]; total: number }> {
    this.logger.log('Getting all formulas');
    return await this.formulaRepository.findAll(pageOptions);
  }

  async getFormulaById(formulaId: string): Promise<Formula> {
    this.logger.log(`Getting formula with ID: ${formulaId}`);
    const formula = await this.formulaRepository.findById(formulaId);

    if (!formula) {
      throw new NotFoundException(FORMULA_MESSAGES.NOT_FOUND);
    }

    return formula;
  }

  async addEgg(formulaId: string): Promise<Formula> {
    this.logger.log(`Adding egg to formula with ID: ${formulaId}`);
    const formula = await this.getFormulaById(formulaId);
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

    return this.formulaRepository.update(formulaId, formula);
  }

  async transformEggToPigeon(formulaId: string, eggId: string, pigeonId: string): Promise<Formula> {
    this.logger.log(`Transforming egg ${eggId} to pigeon ${pigeonId} in formula ${formulaId}`);
    const formula = await this.getFormulaById(formulaId);

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

    return this.formulaRepository.update(formulaId, formula);
  }

  async terminateFormula(formulaId: string, reason: string): Promise<Formula> {
    this.logger.log(`Terminating formula with ID: ${formulaId}`);
    const formula = await this.getFormulaById(formulaId);

    if (formula.status === FormulaStatus.TERMINATED) {
      throw new BadRequestException('Formula is already terminated');
    }

    formula.status = FormulaStatus.TERMINATED;
    formula.history.push({
      action: FormulaActions.FORMULA_GOT_TERMINATED,
      description: reason,
      date: new Date(),
    });

    return this.formulaRepository.update(formulaId, formula);
  }

  async searchFormulas(query: string): Promise<Formula[]> {
    this.logger.log(`Searching formulas with query: ${query}`);
    return await this.formulaRepository.search(query);
  }

  async getFormulaCount(): Promise<number> {
    return await this.formulaRepository.count();
  }

  async getFormulaCountByStatus(status: FormulaStatus): Promise<number> {
    return await this.formulaRepository.countByStatus(status);
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
