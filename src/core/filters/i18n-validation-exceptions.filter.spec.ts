const formatClassValidatorErrorsMock = jest.fn();
jest.mock('~/core/utils/class-validator-formatter.util', () => ({
  formatClassValidatorErrors: formatClassValidatorErrorsMock,
}));

const I18nValidationExceptionFilterMock = jest.fn();
jest.mock('nestjs-i18n/dist/filters/i18n-validation-exception.filter', () => ({
  I18nValidationExceptionFilter: I18nValidationExceptionFilterMock,
}));

import { createMock } from '@golevelup/ts-jest';
import { ValidationError } from '@nestjs/common';
import { buildI18nValidationExceptionFilter } from './i18n-validation-exceptions.filter';

describe('I18nValidationExceptionFilter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should build an instance of I18nValidationExceptionFilter configured properly', () => {
    const filter = buildI18nValidationExceptionFilter();

    expect(filter).toBeInstanceOf(I18nValidationExceptionFilterMock);
    expect(I18nValidationExceptionFilterMock).toBeCalledWith({
      errorFormatter: expect.any(Function),
    });
  });

  it('should build an instance of I18nValidationExceptionFilter configured properly', () => {
    I18nValidationExceptionFilterMock.mockImplementationOnce((props) => props);
    const mockValidationError = createMock<ValidationError>();

    const filter = buildI18nValidationExceptionFilter() as any;
    filter.errorFormatter([mockValidationError]);

    expect(formatClassValidatorErrorsMock).toHaveBeenCalledWith([mockValidationError]);
  });
});
