import { Module, forwardRef } from '@nestjs/common';
import {
  PigeonController,
  PigeonSearchController,
  PigeonParentController,
  PigeonStatusController,
  PigeonDocumentationNumberController,
} from './controllers';
import {
  PigeonService,
  PigeonSearchService,
  PigeonParentService,
  PigeonStatusService,
  DocumentationNumberService,
} from './services';
import { PigeonRepository } from './repositories';
import { ServicesModule } from '@/core/modules';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { HistoryModule } from '@/history/history.module';

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
    PigeonSearchService,
    PigeonParentService,
    PigeonStatusService,
    DocumentationNumberService,
  ],
  exports: [PigeonService, PigeonSearchService, PigeonParentService, PigeonStatusService, DocumentationNumberService],
})
export class PigeonModule {}
