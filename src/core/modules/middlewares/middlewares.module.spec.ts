import { PreValidateAccessTokenMiddleware } from '@backend/keycloak-connect-module';
import { createMock } from '@golevelup/ts-jest';
import { MiddlewareConsumer } from '@nestjs/common';
import { I18nMiddleware } from 'nestjs-i18n';
import { MiddlewaresModule } from './middlewares.module';

describe('MiddlewaresModule', () => {
  let module: MiddlewaresModule;

  beforeEach(() => {
    module = new MiddlewaresModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should register the core middlewares', () => {
    const consumerMock = createMock<MiddlewareConsumer>();

    module.configure(consumerMock);

    expect(consumerMock.apply).toHaveBeenCalledWith(I18nMiddleware);
    expect(consumerMock.apply).toHaveBeenCalledWith(PreValidateAccessTokenMiddleware);
  });
});
