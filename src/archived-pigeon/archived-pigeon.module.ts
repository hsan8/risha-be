import { AuthModule } from '@/auth/auth.module';
import { HistoryModule } from '@/history/history.module';
import { PigeonModule } from '@/pigeon/pigeon.module';
import { ServicesModule } from '@/core/modules';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ArchivedPigeonController } from './controllers';
import { ArchivedPigeonRepository } from './repositories';
import { ArchivedPigeonService } from './services';

@Module({
  imports: [ServicesModule, AuthModule, UserModule, PigeonModule, HistoryModule],
  controllers: [ArchivedPigeonController],
  providers: [ArchivedPigeonRepository, ArchivedPigeonService],
  exports: [ArchivedPigeonService],
})
export class ArchivedPigeonModule {}
