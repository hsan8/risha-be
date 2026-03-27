import { AuthModule } from '@/auth/auth.module';
import { ServicesModule } from '@/core/modules';
import { HistoryModule } from '@/history/history.module';
import { UserModule } from '@/user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import {
  PigeonController,
  PigeonDocumentationNumberController,
  PigeonParentController,
  PigeonSearchController,
  PigeonStatusController,
} from './controllers';
import { PigeonRepository } from './repositories';
import {
  DocumentationNumberService,
  PigeonParentService,
  PigeonSearchService,
  PigeonService,
  PigeonShareCardService,
  PigeonStatusService,
} from './services';

@Module({
  imports: [ServicesModule, AuthModule, UserModule, forwardRef(() => HistoryModule)],
  controllers: [
    PigeonController,
    PigeonSearchController,
    PigeonParentController,
    PigeonStatusController,
    PigeonDocumentationNumberController,
  ],
  providers: [
    PigeonRepository,
    PigeonService,
    PigeonShareCardService,
    PigeonSearchService,
    PigeonParentService,
    PigeonStatusService,
    DocumentationNumberService,
  ],
  exports: [
    PigeonService,
    PigeonSearchService,
    PigeonParentService,
    PigeonStatusService,
    DocumentationNumberService,
    PigeonRepository,
  ],
})
export class PigeonModule {}
