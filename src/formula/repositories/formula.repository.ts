import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { Formula } from '@/formula/entities';
import { CreateFormulaRequestDto } from '@/formula/dto/requests';
import { FirebaseService } from '@/core/services';
import { FORMULA_CONSTANTS } from '@/formula/constants';
import { PageOptionsRequestDto } from '@/core/dtos';
import { FormulaStatus, FormulaActions } from '@/formula/enums';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FormulaRepository {
  private readonly logger = new Logger(FormulaRepository.name);
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(FORMULA_CONSTANTS.COLLECTION_NAME);
  }

  private getUserFormulasRef(userId: string): Reference {
    return this.db.ref(`users/${userId}/formulas`);
  }

  async create(createFormulaDto: CreateFormulaRequestDto, userId: string): Promise<Formula> {
    const formula = this.dtoToEntity(createFormulaDto);
    const userFormulasRef = this.getUserFormulasRef(userId);
    const formulaRef = userFormulasRef.child(formula.id);
    await formulaRef.set(formula);
    this.logger.log(`Created formula with ID: ${formula.id}`);
    return formula;
  }

  async findAll(pageOptions: PageOptionsRequestDto, userId: string): Promise<{ items: Formula[]; total: number }> {
    const userFormulasRef = this.getUserFormulasRef(userId);
    const snapshot = await userFormulasRef.once('value');
    const formulas: Formula[] = [];

    snapshot.forEach((childSnapshot) => {
      const formula = childSnapshot.val() as Formula;
      if (formula) {
        formulas.push(formula);
      }
    });

    formulas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const startIndex = (pageOptions.page - 1) * pageOptions.size;
    const endIndex = startIndex + pageOptions.size;
    const paginatedFormulas = formulas.slice(startIndex, endIndex);

    this.logger.log(
      `Retrieved ${paginatedFormulas.length} formulas (page ${pageOptions.page}, size ${pageOptions.size})`,
    );

    return {
      items: paginatedFormulas,
      total: formulas.length,
    };
  }

  async findById(id: string, userId: string): Promise<Formula | null> {
    const userFormulasRef = this.getUserFormulasRef(userId);
    const snapshot = await userFormulasRef.child(id).once('value');
    return snapshot.val() as Formula;
  }

  async update(id: string, formula: Formula, userId: string): Promise<Formula> {
    formula.updatedAt = new Date();
    const userFormulasRef = this.getUserFormulasRef(userId);
    await userFormulasRef.child(id).update(formula);
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
        const searchFields = [formula.father.name, formula.mother.name, formula.caseNumber, formula.yearOfFormula]
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

  private dtoToEntity(createFormulaDto: CreateFormulaRequestDto): Formula {
    const now = new Date();
    return {
      id: uuidv4(),
      father: {
        id: createFormulaDto.father.id,
        name: createFormulaDto.father.name,
      },
      mother: {
        id: createFormulaDto.mother.id,
        name: createFormulaDto.mother.name,
      },
      caseNumber: createFormulaDto.caseNumber,
      yearOfFormula: createFormulaDto.yearOfFormula,
      status: FormulaStatus.INITIATED,
      eggs: [],
      children: [],
      history: [
        {
          action: FormulaActions.FORMULA_INITIATED,
          description: 'Formula has been created',
          date: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
  }
}
