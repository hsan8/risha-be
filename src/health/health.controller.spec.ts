import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let configMock: DeepMocked<ConfigService>;
  let healthCheckServiceMock: DeepMocked<HealthCheckService>;
  let microserviceHealthIndicatorMock: DeepMocked<MicroserviceHealthIndicator>;
  let httpHealthIndicatorMock: DeepMocked<HttpHealthIndicator>;

  const mockKeycloakAuthServerUrl = 'KEYCLOAK_AUTH_SERVER_URL';
  const mockRabbitMqUri = 'RABBIT_MQ_URI';
  const mockRedisUrl = 'redis://localhost:6379';
  const mockHealthCheckResult: HealthCheckResult = { status: 'ok', details: {} };

  beforeEach(async () => {
    // Mocks
    configMock = createMock<ConfigService>({
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'KEYCLOAK_AUTH_SERVER_URL':
            return mockKeycloakAuthServerUrl;
          case 'RABBIT_MQ_URI':
            return mockRabbitMqUri;
          case 'REDIS_URL':
            return mockRedisUrl;
          default:
            throw new Error(`Unexpected key: ${key}`);
        }
      }),
    });
    healthCheckServiceMock = createMock<HealthCheckService>({ check: jest.fn() });
    microserviceHealthIndicatorMock = createMock<MicroserviceHealthIndicator>();
    httpHealthIndicatorMock = createMock<HttpHealthIndicator>();

    // Module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: ConfigService, useValue: configMock },
        { provide: HealthCheckService, useValue: healthCheckServiceMock },
        { provide: MicroserviceHealthIndicator, useValue: microserviceHealthIndicatorMock },
        { provide: HttpHealthIndicator, useValue: httpHealthIndicatorMock },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  describe('With no detailed dependencies checks', () => {
    it('should return a health check result with no details', async () => {
      healthCheckServiceMock.check.mockResolvedValueOnce(mockHealthCheckResult);

      const result = await healthController.checkHealth();

      expect(result).toEqual(mockHealthCheckResult);
      expect(healthCheckServiceMock.check).toHaveBeenCalledTimes(1);
      expect(healthCheckServiceMock.check).toHaveBeenCalledWith([]);
    });
  });

  describe('With detailed dependencies checks', () => {
    it('should return a health check result with dependencies details', async () => {
      const expectedIndicatorsCnt = 4;
      healthCheckServiceMock.check.mockResolvedValueOnce(mockHealthCheckResult);

      const result = await healthController.checkHealthDetails();

      expect(result).toEqual(mockHealthCheckResult);
      expect(healthCheckServiceMock.check).toHaveBeenCalledTimes(1);
      expect(healthCheckServiceMock.check).toHaveBeenCalledWith(
        Array(expectedIndicatorsCnt).fill(expect.any(Function)),
      );
    });

    it('should use the expected health indicators to get the health result', async () => {
      const expectedIndicatorsCnt = 4;
      healthCheckServiceMock.check.mockImplementationOnce((indicators) => indicators as any);

      const indicators: any = await healthController.checkHealthDetails();
      expect(healthCheckServiceMock.check).toHaveBeenCalledWith(
        Array(expectedIndicatorsCnt).fill(expect.any(Function)),
      );

      // call each indicator to check the arguments passed to it
      for (let i = 0; i < expectedIndicatorsCnt; i++) {
        indicators[`${i}`]();
      }
      // http health indicator(s)
      expect(httpHealthIndicatorMock.pingCheck).toHaveBeenCalledTimes(1);
      expect(httpHealthIndicatorMock.pingCheck).toHaveBeenCalledWith(
        'external-keycloak',
        `${mockKeycloakAuthServerUrl}/`,
      );

      // microservice health indicator(s)
      expect(microserviceHealthIndicatorMock.pingCheck).toHaveBeenCalledTimes(2);
      expect(microserviceHealthIndicatorMock.pingCheck).toHaveBeenCalledWith('rabbit-mq', {
        transport: Transport.RMQ,
        options: { urls: [mockRabbitMqUri] },
      });
      expect(microserviceHealthIndicatorMock.pingCheck).toHaveBeenCalledWith('redis', {
        transport: Transport.REDIS,
        options: { host: 'localhost', port: '6379' },
      });
    });
  });
});
