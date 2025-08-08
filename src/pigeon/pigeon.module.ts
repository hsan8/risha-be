import { Module } from '@nestjs/common';
import {
  PigeonController,
  PigeonSearchController,
  PigeonParentController,
  PigeonStatusController,
  PigeonRegistrationController,
} from './controllers';
import { PigeonService } from './services';
import { RegistrationNumberService } from './services';
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
    PigeonRegistrationController,
  ],
  providers: [PigeonService, RegistrationNumberService, PigeonRepository],
  exports: [PigeonService, RegistrationNumberService],
})
export class PigeonModule {}
