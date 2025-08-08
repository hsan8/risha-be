import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { I18nModule } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { AllExceptionsFilter, buildI18nValidationExceptionFilter } from './core/filters';
import { buildConfigOptions, buildI18nOptions, buildPinoOptions } from './core/module-options';
import { MiddlewaresModule } from './core/modules';
import { ServicesModule } from './core/modules/services/services.module';
import { buildValidationPipe } from './core/pipes';
import { HealthModule } from './health/health.module';
import { PigeonModule } from './pigeon/pigeon.module';
import { FormulaModule } from './formula/formula.module';
import { AuthModule } from './auth/auth.module';
import { Environment } from './core/enums';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(buildConfigOptions()),
    I18nModule.forRoot(buildI18nOptions()),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env = config.get('NODE_ENV');
        if (env === Environment.DEV) {
          return buildPinoOptions(config);
        }
        // In production, return empty options to use default console logging
        return {};
      },
    }),
    MiddlewaresModule, // LoggerModule must be registered first before this module
    ServicesModule, // Global services module

    // Service modules
    AuthModule,
    UserModule,
    PigeonModule,
    FormulaModule,
    HealthModule,
  ],
  providers: [
    // Global Pipes (order matters)
    {
      inject: [ConfigService],
      provide: APP_PIPE,
      useFactory: (config: ConfigService) => buildValidationPipe(config),
    },

    // Global Filters (order matters)
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useValue: buildI18nValidationExceptionFilter() },
  ],
})
export class AppModule {}
