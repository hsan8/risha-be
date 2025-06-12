import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { I18nModule } from './core/i18n';
import { cacheOptions, jwtModuleOption, ThrottlerConfigService, typeOrmModuleOption } from './core/module-options';
import { HealthModule } from './health/health.module';
import { PaymentLoggerModule } from './payment-logs/payment-logger.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
    }),

    CacheModule.registerAsync({
      useFactory: cacheOptions,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmModuleOption,
      inject: [ConfigService],
    }),

    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
        config: {},
      },
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => new ThrottlerConfigService(configService).createThrottlerOptions(),
    }),

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtModuleOption,
    }),

    I18nModule,
    HealthModule,
    // MS modules
    // keep order
    PaymentLoggerModule,
    PaymentModule,
    // KnetModule,
  ],
  controllers: [],
  providers: [
    // {
    // provide: APP_INTERCEPTOR,
    // useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
