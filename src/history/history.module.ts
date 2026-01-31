import { Module, forwardRef } from '@nestjs/common';
import { HistoryController } from './controllers';
import { HistoryService } from './services';
import { HistoryRepository } from './repositories';
import { ServicesModule } from '@/core/modules';
import { AuthModule } from '@/auth/auth.module';
import { PigeonModule } from '@/pigeon/pigeon.module';

@Module({
  imports: [ServicesModule, AuthModule, forwardRef(() => PigeonModule)],
  controllers: [HistoryController],
  providers: [HistoryRepository, HistoryService],
  exports: [HistoryRepository, HistoryService],
})
export class HistoryModule {}
