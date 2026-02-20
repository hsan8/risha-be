import { AuthModule } from '@/auth/auth.module';
import { ServicesModule } from '@/core/modules';
import { PigeonModule } from '@/pigeon/pigeon.module';
import { Module, forwardRef } from '@nestjs/common';
import { HistoryController } from './controllers';
import { HistoryRepository } from './repositories';
import { HistoryService } from './services';

@Module({
  imports: [ServicesModule, AuthModule, forwardRef(() => PigeonModule)],
  controllers: [HistoryController],
  providers: [HistoryRepository, HistoryService],
  exports: [HistoryRepository, HistoryService],
})
export class HistoryModule {}
