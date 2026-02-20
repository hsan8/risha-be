import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AUTH_CONSTANTS } from './constants/auth.constants';
import { GoogleAuthController } from './controllers';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OTPRepository } from './repositories/otp.repository';
import { UserRepository } from './repositories/user.repository';
import { AppleAuthService } from './services/apple-auth.service';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { GoogleAuthService } from './services/google-auth.service';
import { JwtService as CustomJwtService } from './services/jwt.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: AUTH_CONSTANTS.JWT_SECRET,
      signOptions: {
        expiresIn: AUTH_CONSTANTS.JWT_ACCESS_TOKEN_EXPIRY,
      },
    }),
    UserModule,
  ],
  controllers: [AuthController, GoogleAuthController],
  providers: [
    AuthService,
    CustomJwtService,
    EmailService,
    GoogleAuthService,
    AppleAuthService,
    UserRepository,
    OTPRepository,
    JwtAuthGuard,
  ],
  exports: [AuthService, CustomJwtService, OTPRepository, JwtModule, JwtAuthGuard, UserModule],
})
export class AuthModule {}
