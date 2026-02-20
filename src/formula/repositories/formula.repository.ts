import { FirebaseService } from '@/core/services';
import { FORMULA_CONSTANTS } from '@/formula/constants';
import { CreateFormulaRequestDto } from '@/formula/dto/requests';
import { Formula } from '@/formula/entities';
import { FormulaStatus } from '@/formula/enums';
import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FormulaRepository {
  private readonly logger = new Logger(FormulaRepository.name);
  private readonly db: Database;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
  }

  private getUserFormulasRef(userId: string): Reference {
    return this.db.ref(FORMULA_CONSTANTS.COLLECTION_NAME).child(userId);
  }

  async findAll(userId: string): Promise<Formula[]> {
    this.logger.log('FormulaRepository.findAll - Starting database query...');
    const userFormulasRef = this.getUserFormulasRef(userId);

    try {
      const snapshot = await userFormulasRef.once('value');
      const formulas: Formula[] = [];

      snapshot.forEach((childSnapshot) => {
        const formula = childSnapshot.val() as Formula;
        if (formula) {
          formulas.push(formula);
        }
      });

      formulas.sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf());

      return formulas;
    } catch (error) {
      this.logger.error('FormulaRepository.findAll - Database error:', error);
      throw error;
    }
  }

  async findById(id: string, userId: string): Promise<Formula | null> {
    const userFormulasRef = this.getUserFormulasRef(userId);
    const snapshot = await userFormulasRef.child(id).once('value');

    const formula = snapshot.val() as Formula;
    return formula ?? null;
  }

  async create(createFormulaDto: CreateFormulaRequestDto, userId: string): Promise<Formula> {
    const formula = this.dtoToEntity(createFormulaDto);
    const userFormulasRef = this.getUserFormulasRef(userId);
    const formulaRef = userFormulasRef.child(formula.id);
    await formulaRef.set(formula);
    this.logger.log(`Created formula with ID: ${formula.id}`);
    return formula;
  }

  async update(id: string, formula: Formula, userId: string): Promise<Formula> {
    formula.updatedAt = moment().toDate();
    const formulaRef = this.getUserFormulasRef(userId).child(id);
    await formulaRef.update(formula);
    this.logger.log(`Updated formula with ID: ${id}`);
    return formula;
  }

  async search(query: string, userId: string): Promise<Formula[]> {
    const userFormulasRef = this.getUserFormulasRef(userId);
    const snapshot = await userFormulasRef.once('value');
    const formulas: Formula[] = [];

    snapshot.forEach((childSnapshot) => {
      const formula = childSnapshot.val() as Formula;
      if (formula) {
        const searchFields = [formula.father?.name, formula.mother?.name, formula.caseNumber, formula.yearOfFormula]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (searchFields.includes(query.toLowerCase())) {
          formulas.push(formula);
        }
      }
    });

    this.logger.log(`Search for "${query}" returned ${formulas.length} results`);
    return formulas;
  }

  async count(userId: string): Promise<number> {
    const userFormulasRef = this.getUserFormulasRef(userId);
    const snapshot = await userFormulasRef.once('value');
    return snapshot.numChildren();
  }

  async countByStatus(status: FormulaStatus, userId: string): Promise<number> {
    const userFormulasRef = this.getUserFormulasRef(userId);
    const snapshot = await userFormulasRef.once('value');
    let count = 0;

    snapshot.forEach((childSnapshot) => {
      const formula = childSnapshot.val() as Formula;
      if (formula && formula.status === status) {
        count++;
      }
    });

    return count;
  }

  /** Maps DTO to entity. Formula id is UUID v4 (not Firebase push key). */
  private dtoToEntity(createFormulaDto: CreateFormulaRequestDto): Formula {
    const now = moment().toDate();
    const father = createFormulaDto.father!;
    const mother = createFormulaDto.mother!;

    return {
      id: uuidv4(),
      father: {
        id: father.id,
        name: father.name ?? '',
      },
      mother: {
        id: mother.id,
        name: mother.name ?? '',
      },
      caseNumber: createFormulaDto.caseNumber,
      yearOfFormula: createFormulaDto.yearOfFormula,
      status: FormulaStatus.INITIATED,
      eggs: [],
      children: [],
      createdAt: now,
      updatedAt: now,
    };
  }
}
