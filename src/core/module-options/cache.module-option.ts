import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import redisStore from 'cache-manager-redis-store';

export const cacheOptions = (configService: ConfigService): CacheModuleOptions => {
  const options: CacheModuleOptions = {
    isGlobal: true,
    store: redisStore as any,
    host: configService.get<string>('REDIS_HOST') || 'localhost',
    port: +configService.get<string>('REDIS_PORT') || 6379,
    ttl: +configService.get<string>('REDIS_TTL') || 60 * 5, // Default time to live in seconds
    password: configService.get<string>('REDIS_PASSWORD') || undefined,
  };

  return options;
};
