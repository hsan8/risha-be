import { ServicesModule } from '@/core/modules';
import { Module } from '@nestjs/common';
import { ArchivedFormulaRepository } from './repositories';

@Module({
  imports: [ServicesModule],
  providers: [ArchivedFormulaRepository],
  exports: [ArchivedFormulaRepository],
})
export class ArchivedFormulaModule {}
