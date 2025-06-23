import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
  MicroserviceHealthIndicatorOptions,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { parseURL as parseRedisURL } from 'ioredis/built/utils';

@Controller('health')
@ApiTags('Health')
@SkipThrottle()
export class HealthController {
  constructor(
    private readonly config: ConfigService,
    private readonly healthCheckService: HealthCheckService,
    private readonly microserviceHealthIndicator: MicroserviceHealthIndicator,
    private readonly databaseHealthIndicator: TypeOrmHealthIndicator,
    private readonly httpHealthIndicator: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  checkHealth() {
    return this.healthCheckService.check([]);
  }

  @Get('details')
  @HealthCheck()
  checkHealthDetails() {
    const extKeycloakServerUrl = `${this.config.getOrThrow('KEYCLOAK_AUTH_SERVER_URL')}/`;
    const rabbitMqOptions: MicroserviceHealthIndicatorOptions<RmqOptions> = {
      transport: Transport.RMQ,
      options: {
        urls: [this.config.getOrThrow<string>('RABBIT_MQ_URI')],
      },
    };
    const redisOptions: MicroserviceHealthIndicatorOptions<RedisOptions> = {
      transport: Transport.REDIS,
      options: {
        ...parseRedisURL(this.config.getOrThrow<string>('REDIS_URL')),
      },
    };

    const healthIndicators = [
      () => this.databaseHealthIndicator.pingCheck('database'),
      () => this.httpHealthIndicator.pingCheck('external-keycloak', extKeycloakServerUrl),
      () => this.microserviceHealthIndicator.pingCheck<RmqOptions>('rabbit-mq', rabbitMqOptions),
      () => this.microserviceHealthIndicator.pingCheck<RedisOptions>('redis', redisOptions),
    ];

    return this.healthCheckService.check(healthIndicators);
  }
}
