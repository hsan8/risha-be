import { Module } from '@nestjs/common';
import {
  FormulaRegistrationController,
  FormulaStatusController,
  FormulaSearchController,
  FormulaParentController,
} from './controllers';
import { FormulaService } from './services';
import { FormulaRepository } from './repositories';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { PigeonRepository } from '@/pigeon/repositories';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [
    FormulaRegistrationController,
    FormulaStatusController,
    FormulaSearchController,
    FormulaParentController,
  ],
  providers: [FormulaService, FormulaRepository, PigeonRepository],
  exports: [FormulaService],
})
export class FormulaModule {}
