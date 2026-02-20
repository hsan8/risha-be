import { AuthModule } from '@/auth/auth.module';
import { ServicesModule } from '@/core/modules';
import { FormulaModule } from '@/formula/formula.module';
import { Module, forwardRef } from '@nestjs/common';
import { FormulaHistoryController } from './controllers';
import { FormulaHistoryRepository } from './repositories';
import { FormulaHistoryService } from './services';

@Module({
  imports: [ServicesModule, AuthModule, forwardRef(() => FormulaModule)],
  controllers: [FormulaHistoryController],
  providers: [FormulaHistoryRepository, FormulaHistoryService],
  exports: [FormulaHistoryRepository, FormulaHistoryService],
})
export class FormulaHistoryModule {}
