import { ArchivedFormulaModule } from '@/archived-formula/archived-formula.module';
import { AuthModule } from '@/auth/auth.module';
import { FormulaHistoryModule } from '@/formula-history/formula-history.module';
import { PigeonRepository } from '@/pigeon/repositories';
import { UserModule } from '@/user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import {
  FormulaController,
  FormulaParentController,
  FormulaRegistrationController,
  FormulaSearchController,
  FormulaStatusController,
} from './controllers';
import { FormulaRepository } from './repositories';
import { FormulaService } from './services';

@Module({
  imports: [AuthModule, UserModule, forwardRef(() => FormulaHistoryModule), ArchivedFormulaModule],
  controllers: [
    FormulaController,
    FormulaRegistrationController,
    FormulaStatusController,
    FormulaSearchController,
    FormulaParentController,
  ],
  providers: [FormulaService, FormulaRepository, PigeonRepository],
  exports: [FormulaService],
})
export class FormulaModule {}
