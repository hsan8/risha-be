import { Module } from '@nestjs/common';
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
import { ServicesModule } from '../core/modules/services/services.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [ServicesModule, AuthModule, UserModule],
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
