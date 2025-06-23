import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { Environment } from '../enums';

export function buildValidationPipe(config: ConfigService): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    validateCustomDecorators: true,
    stopAtFirstError: true,
    forbidNonWhitelisted: false,
    dismissDefaultMessages: true,
    enableDebugMessages: config.getOrThrow('NODE_ENV') === Environment.DEV,
    exceptionFactory: i18nValidationErrorFactory,
  });
}
