import { AuthModule } from '@/auth/auth.module';
import { ServicesModule } from '@/core/modules';
import { FormulaHistoryRepository } from '@/formula-history/repositories';
import { PigeonRepository } from '@/pigeon/repositories';
import { Module } from '@nestjs/common';
import { ArchivedFormulaController } from './controllers';
import { ArchivedFormulaRepository } from './repositories';
import { ArchivedFormulaPdfService, ArchivedFormulaService } from './services';

@Module({
  imports: [ServicesModule, AuthModule],
  controllers: [ArchivedFormulaController],
  providers: [
    ArchivedFormulaRepository,
    ArchivedFormulaService,
    ArchivedFormulaPdfService,
    FormulaHistoryRepository,
    PigeonRepository,
  ],
  exports: [ArchivedFormulaRepository, ArchivedFormulaService],
})
export class ArchivedFormulaModule {}
