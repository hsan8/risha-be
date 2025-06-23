const ValidationPipeMock = jest.fn();
jest.mock('@nestjs/common/pipes/validation.pipe', () => ({
  ValidationPipe: ValidationPipeMock,
}));

import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { Environment } from '~/core/enums';
import { buildValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  let configMock: DeepMocked<ConfigService>;

  beforeEach(() => {
    configMock = createMock<ConfigService>({
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'NODE_ENV':
            return Environment.DEV;
          default:
            throw new Error(`Unexpected key: ${key}`);
        }
      }),
    });
  });

  it('should build an instance of ValidationPipe configured properly', () => {
    const pipe = buildValidationPipe(configMock);

    expect(pipe).toBeInstanceOf(ValidationPipeMock);
    expect(ValidationPipeMock).toBeCalledWith({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: false,
      dismissDefaultMessages: true,
      enableDebugMessages: true,
      exceptionFactory: i18nValidationErrorFactory,
    });
  });
});
