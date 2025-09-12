import { Module } from '@nestjs/common';
import { ServicesModule } from '@/core/modules/services/services.module';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_CONSTANTS } from '@/auth/constants';
import { UserController } from './controllers';
import { UserService, UserStatisticsService } from './services';
import { UserRepository, UserStatisticsRepository } from './repositories';

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
