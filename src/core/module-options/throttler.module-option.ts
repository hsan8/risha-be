import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { seconds, ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';
import Redis from 'ioredis';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      throttlers: [{ limit: 500, ttl: seconds(60) }],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: this.configService.get<string>('REDIS_HOST') || 'localhost',
          port: parseInt(this.configService.get<string>('REDIS_PORT'), 10) || 6379,
          password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
        }),
      ),
    };
  }
}
