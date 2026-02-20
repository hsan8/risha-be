import { AUTH_CONSTANTS } from '@/auth/constants';
import { ServicesModule } from '@/core/modules/services/services.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers';
import { UserRepository, UserStatisticsRepository } from './repositories';
import { UserService, UserStatisticsService } from './services';

@Module({
  imports: [
    ServicesModule,
    JwtModule.register({
      secret: AUTH_CONSTANTS.JWT_SECRET,
      signOptions: { expiresIn: AUTH_CONSTANTS.JWT_ACCESS_TOKEN_EXPIRY },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserStatisticsRepository, UserStatisticsService],
  exports: [UserService, UserStatisticsService],
})
export class UserModule {}
