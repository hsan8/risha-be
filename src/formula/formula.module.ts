import { Module } from '@nestjs/common';
import {
  FormulaRegistrationController,
  FormulaStatusController,
  FormulaSearchController,
  FormulaParentController,
} from './controllers';
import { FormulaService } from './services';
import { FormulaRepository } from './repositories';

@Module({
  controllers: [
    FormulaRegistrationController,
    FormulaStatusController,
    FormulaSearchController,
    FormulaParentController,
  ],
  providers: [FormulaService, FormulaRepository],
  exports: [FormulaService],
})
export class FormulaModule {}
