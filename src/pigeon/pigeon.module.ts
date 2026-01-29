import { Module } from '@nestjs/common';
import {
  PigeonController,
  PigeonSearchController,
  PigeonParentController,
  PigeonStatusController,
  PigeonDocumentationNumberController,
} from './controllers';
import { PigeonService } from './services';
import { DocumentationNumberService } from './services';
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
  providers: [PigeonService, DocumentationNumberService, PigeonRepository],
  exports: [PigeonService, DocumentationNumberService],
})
export class PigeonModule {}
