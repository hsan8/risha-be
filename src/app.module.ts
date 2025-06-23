import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { AllExceptionsFilter, buildI18nValidationExceptionFilter } from './core/filters';
import { buildConfigOptions, buildI18nOptions, buildPinoOptions } from './core/module-options';
import { MiddlewaresModule } from './core/modules';
import { buildValidationPipe } from './core/pipes';
import { HealthModule } from './health/health.module';

const APP_NAME = 'RISHA_BACKEND';

@Module({
  imports: [
    // Core modules: Order matters
    ConfigModule.forRoot(buildConfigOptions()),
    I18nModule.forRoot(buildI18nOptions()),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => buildPinoOptions(config),
    }),
    MiddlewaresModule, // LoggerModule must be registered first before this module

    // Service modules
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
