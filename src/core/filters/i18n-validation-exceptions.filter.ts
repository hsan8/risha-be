import { ValidationError } from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { formatClassValidatorErrors } from '../utils';

export function buildI18nValidationExceptionFilter(): I18nValidationExceptionFilter {
  return new I18nValidationExceptionFilter({
    errorFormatter: (errors: ValidationError[]) => formatClassValidatorErrors(errors),
  });
}
