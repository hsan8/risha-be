import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { I18nModule } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { Environment } from './core/enums';
import { AllExceptionsFilter, buildI18nValidationExceptionFilter } from './core/filters';
import { LanguageInterceptor } from './core/interceptors';
import { buildConfigOptions, buildI18nOptions, buildPinoOptions } from './core/module-options';
import { MiddlewaresModule } from './core/modules';
import { ServicesModule } from './core/modules/services/services.module';
import { buildValidationPipe } from './core/pipes';
import { FormulaHistoryModule } from './formula-history/formula-history.module';
import { FormulaModule } from './formula/formula.module';
import { HealthModule } from './health/health.module';
import { HistoryModule } from './history/history.module';
import { ArchivedPigeonModule } from './archived-pigeon/archived-pigeon.module';
import { NewsModule } from './news/news.module';
import { PigeonModule } from './pigeon/pigeon.module';
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
    ArchivedPigeonModule,
    HistoryModule,
    FormulaHistoryModule,
    FormulaModule,
    NewsModule,
    HealthModule,
  ],
  providers: [
    // Global Interceptors (resolve language from x-language / Accept-Language / query)
    { provide: APP_INTERCEPTOR, useClass: LanguageInterceptor },

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
