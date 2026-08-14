import { ArchivedFormulaModule } from '@/archived-formula/archived-formula.module';
import { ArchivedPigeonModule } from '@/archived-pigeon/archived-pigeon.module';
import { AuthModule } from '@/auth/auth.module';
import { FormulaModule } from '@/formula/formula.module';
import { HistoryModule } from '@/history/history.module';
import { NewsModule } from '@/news/news.module';
import { PigeonModule } from '@/pigeon/pigeon.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AdminEntitiesController, AdminOverviewController, AdminUsersController } from './controllers';
import { AdminGuard } from './guards';
import { AdminOverviewService } from './services';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PigeonModule,
    FormulaModule,
    ArchivedPigeonModule,
    ArchivedFormulaModule,
    HistoryModule,
    NewsModule,
  ],
  controllers: [AdminOverviewController, AdminUsersController, AdminEntitiesController],
  providers: [AdminGuard, AdminOverviewService],
})
export class AdminModule {}
