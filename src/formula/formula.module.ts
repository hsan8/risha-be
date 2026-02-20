import { AuthModule } from '@/auth/auth.module';
import { PigeonRepository } from '@/pigeon/repositories';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import {
  FormulaParentController,
  FormulaRegistrationController,
  FormulaSearchController,
  FormulaStatusController,
} from './controllers';
import { FormulaRepository } from './repositories';
import { FormulaService } from './services';

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
