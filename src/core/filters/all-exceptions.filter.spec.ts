const i18nTMock = jest.fn();
const i18nTsMock = jest.fn();
const I18nContextWrapperMock = jest.fn().mockReturnValue({
  t: i18nTMock,
  ts: i18nTsMock,
});
jest.mock('../utils/i18n-context-wrapper.util', () => ({
  I18nContextWrapper: I18nContextWrapperMock,
}));

import { DeepMocked, createMock } from '@golevelup/ts-jest';
import {
  ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Response as ExpressResponse } from 'express';
import { Observable } from 'rxjs';
import { ErrorCategory } from '../enums';
import { CustomRpcException } from '../exceptions';
import { AllExceptionsFilter } from './all-exceptions.filter';

const LOG_CONTEXT = 'AllExceptionsFilter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  let loggerMock: DeepMocked<Logger>;
  let responseMock: DeepMocked<ExpressResponse>;
  let hostMock: DeepMocked<ArgumentsHost>;
  let getRequestMock: jest.Mock;

  beforeEach(async () => {
    loggerMock = createMock<Logger>();
    getRequestMock = jest.fn().mockReturnValue({ originalUrl: '/test' });
    responseMock = createMock<ExpressResponse>({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    });
    hostMock = createMock<ArgumentsHost>({
      getType: jest.fn().mockReturnValue('http'),
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
        getRequest: getRequestMock,
      }),
    });
    i18nTMock.mockImplementation((key: string) => `LOCALIZED_${key}`);

    const moduleRef = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();
    moduleRef.useLogger(loggerMock);

    filter = moduleRef.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Exceptions in rpc context', () => {
    it('should return rpc custom exception', () => {
      const exception = new ForbiddenException();
      hostMock.getType.mockReturnValueOnce('rpc');

      const err$ = filter.catch(exception, hostMock) as Observable<never>;

      err$.subscribe({
        error(err) {
          expect(err).toEqual(new CustomRpcException(exception));
        },
      });
    });
  });

  describe('Exceptions in health check details endpoint', () => {
    it('should return 210 status code and empty JSON response for health check details', () => {
      getRequestMock.mockReturnValue({ originalUrl: '/health/details' });
      const exception = {
        response: { status: 'error' },
      };

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(210);
      expect(responseMock.json).toHaveBeenCalledWith(exception.response);
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
    });
  });

  describe('Known Http Exceptions', () => {
    it.each([
      {
        exception: new UnauthorizedException(),
        category: ErrorCategory.UNAUTHORIZED_ERROR,
        expectedStatus: HttpStatus.UNAUTHORIZED,
        expectedCategory: ErrorCategory.UNAUTHORIZED_ERROR,
        expectedMessage: ErrorCategory.UNAUTHORIZED_ERROR,
      },
      {
        exception: new ForbiddenException(),
        category: ErrorCategory.FORBIDDEN_ERROR,
        expectedStatus: HttpStatus.FORBIDDEN,
        expectedCategory: ErrorCategory.FORBIDDEN_ERROR,
        expectedMessage: ErrorCategory.FORBIDDEN_ERROR,
      },
      {
        exception: new NotFoundException(),
        category: ErrorCategory.NOT_FOUND_ERROR,
        expectedStatus: HttpStatus.NOT_FOUND,
        expectedCategory: ErrorCategory.NOT_FOUND_ERROR,
        expectedMessage: ErrorCategory.NOT_FOUND_ERROR,
      },
      {
        exception: new InternalServerErrorException(),
        category: ErrorCategory.INTERNAL_SERVER_ERROR,
        expectedStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        expectedCategory: ErrorCategory.INTERNAL_SERVER_ERROR,
        expectedMessage: ErrorCategory.INTERNAL_SERVER_ERROR,
      },
      {
        exception: new NotFoundException({
          category: ErrorCategory.BUSINESS_ERROR,
          message: 'CUSTOM_ERROR',
        }),
        category: ErrorCategory.NOT_FOUND_ERROR,
        expectedStatus: HttpStatus.NOT_FOUND,
        expectedCategory: ErrorCategory.BUSINESS_ERROR,
        expectedMessage: 'LOCALIZED_CUSTOM_ERROR',
      },
    ])(
      'should return error response with "$category" category in case of $exception',
      ({ exception, category, expectedStatus, expectedCategory, expectedMessage }) => {
        i18nTsMock.mockImplementationOnce((...keys: string[]) =>
          keys.some((key) => key === 'CUSTOM_ERROR') ? 'LOCALIZED_CUSTOM_ERROR' : keys.pop(),
        );

        filter.catch(exception, hostMock);

        expect(responseMock.status).toHaveBeenCalledWith(expectedStatus);
        expect(responseMock.json).toHaveBeenCalledWith({
          category: expectedCategory,
          message: expectedMessage,
          errors: [],
        });
        expect(i18nTsMock).toHaveBeenCalledWith(exception.message, category);
        expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
      },
    );
  });

  describe('Unknown Exceptions/Errors', () => {
    it('should return error response with "UNHANDLED_ERROR" category in case of unknown http exceptions', () => {
      const msg = 'test message';
      const exception = new BadRequestException(msg);

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseMock.json).toHaveBeenCalledWith({
        category: ErrorCategory.UNHANDLED_ERROR,
        message: `LOCALIZED_${msg}`,
        errors: [],
      });
      expect(i18nTMock).toHaveBeenCalledWith(msg);
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
    });

    it('should return error response with "INTERNAL_SERVER_ERROR" category in case of unknown errors', () => {
      i18nTsMock.mockReturnValueOnce('XYZ');
      const msg = 'test error';
      const exception = new Error(msg);

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(responseMock.json).toHaveBeenCalledWith({
        category: ErrorCategory.INTERNAL_SERVER_ERROR,
        message: 'XYZ',
        errors: [],
      });
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
    });

    it('should return error response with "VALIDATION_ERROR" category in case of request body parsing errors', () => {
      const msg = 'Unexpected end of JSON input';
      const exception = new BadRequestException(msg);

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseMock.json).toHaveBeenCalledWith({
        category: ErrorCategory.VALIDATION_ERROR,
        message: `LOCALIZED_${msg}`,
        errors: [],
      });
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
    });

    it('should return error response with passed category', () => {
      const msg = 'Business error';
      const exception = new UnprocessableEntityException({
        category: ErrorCategory.BUSINESS_ERROR,
        message: msg,
      });

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(responseMock.json).toHaveBeenCalledWith({
        category: ErrorCategory.BUSINESS_ERROR,
        message: `LOCALIZED_${msg}`,
        errors: [],
      });
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
    });

    it('should return error response with default category if not passed', () => {
      const exception = { status: HttpStatus.CONFLICT };

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(responseMock.json).toHaveBeenCalledWith({
        category: ErrorCategory.UNHANDLED_ERROR,
        message: `LOCALIZED_${undefined}`,
        errors: [],
      });
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
    });

    it('should return error response with list of passed errors (localized)', () => {
      const msg = 'test message';
      const field = 'name';
      const fieldError = 'IsEmpty';
      const exception = new BadRequestException({
        message: msg,
        errors: [{ field, message: fieldError }],
      });

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseMock.json).toHaveBeenCalledWith({
        category: ErrorCategory.UNHANDLED_ERROR,
        message: `LOCALIZED_${msg}`,
        errors: [{ field, message: `LOCALIZED_${fieldError}` }],
      });
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
    });

    it('should return extracted category even if it was parsing error in case of unknown i18n value', () => {
      const msg = 'Unexpected end of JSON input';
      const exception = new BadRequestException(msg);
      i18nTMock.mockReturnValueOnce(undefined);

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseMock.json).toHaveBeenCalledWith({
        category: ErrorCategory.UNHANDLED_ERROR,
        errors: [],
      });
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
    });
  });

  describe('Fallback', () => {
    it('should fallback to a proper error response in case of error in handling the exception', () => {
      const error = new Error('Unknown Error');
      getRequestMock.mockImplementationOnce(() => {
        throw error;
      });
      const exception = new BadRequestException();

      filter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(responseMock.json).toHaveBeenCalledWith({
        category: ErrorCategory.INTERNAL_SERVER_ERROR,
        message: `LOCALIZED_${ErrorCategory.INTERNAL_SERVER_ERROR}`,
        errors: [],
      });
      expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
      expect(loggerMock.error).toHaveBeenCalledWith(error, undefined, LOG_CONTEXT);
    });
  });

  describe('Extract exception status/message', () => {
    describe('Status Code', () => {
      it.each([
        {
          path: 'exception.response?.status',
          exception: { response: { status: HttpStatus.SERVICE_UNAVAILABLE } },
        },
        {
          path: 'exception.response?.statusCode',
          exception: { response: { statusCode: HttpStatus.SERVICE_UNAVAILABLE } },
        },
        {
          path: 'exception.rpcError?.status',
          exception: { rpcError: { status: HttpStatus.SERVICE_UNAVAILABLE } },
        },
        {
          path: 'exception.status',
          exception: { status: HttpStatus.SERVICE_UNAVAILABLE },
        },
      ])('$path', ({ exception }) => {
        filter.catch(exception, hostMock);

        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
        expect(responseMock.json).toHaveBeenCalledWith({
          category: ErrorCategory.UNHANDLED_ERROR,
          message: `LOCALIZED_undefined`,
          errors: [],
        });
        expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
      });
    });

    describe('Message', () => {
      it.each([
        {
          path: 'exception.response?.data?.data?.error',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, data: { data: { error: 'ERROR_MSG' } } },
          },
        },
        {
          path: 'exception.response?.data?.error',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, data: { error: 'ERROR_MSG' } },
          },
        },
        {
          path: 'exception.response?.data?.errorMessage',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, data: { errorMessage: 'ERROR_MSG' } },
          },
        },
        {
          path: 'exception.response?.message',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, message: 'ERROR_MSG' },
          },
        },
        {
          path: 'exception.response?.error',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, error: 'ERROR_MSG' },
          },
        },
        {
          path: 'exception.rpcError?.message',
          exception: {
            rpcError: { status: HttpStatus.SERVICE_UNAVAILABLE, message: 'ERROR_MSG' },
          },
        },
        {
          path: 'exception.message',
          exception: { status: HttpStatus.SERVICE_UNAVAILABLE, message: 'ERROR_MSG' },
        },
      ])('$path', ({ exception }) => {
        filter.catch(exception, hostMock);

        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
        expect(responseMock.json).toHaveBeenCalledWith({
          category: ErrorCategory.UNHANDLED_ERROR,
          message: `LOCALIZED_ERROR_MSG`,
          errors: [],
        });
        expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
      });

      it.each([
        {
          path: 'exception.response?.message (null message)',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, message: null },
          },
          expectedMsg: 'LOCALIZED_null',
        },
        {
          path: 'exception.response?.message (undefined message)',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, message: undefined },
          },
          expectedMsg: 'LOCALIZED_undefined',
        },
        {
          path: 'exception.response?.message (0 message)',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, message: 0 },
          },
          expectedMsg: 'LOCALIZED_0',
        },
        {
          path: 'exception.response?.message (undefined message)',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, message: false },
          },
          expectedMsg: `LOCALIZED_false`,
        },
        {
          path: 'exception.response?.message ("" message)',
          exception: {
            response: { status: HttpStatus.SERVICE_UNAVAILABLE, message: '' },
          },
          expectedMsg: `LOCALIZED_`,
        },
      ])('$path', ({ exception, expectedMsg }) => {
        filter.catch(exception, hostMock);

        expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
        expect(responseMock.json).toHaveBeenCalledWith({
          category: ErrorCategory.UNHANDLED_ERROR,
          message: expectedMsg,
          errors: [],
        });
        expect(loggerMock.error).toHaveBeenCalledWith(exception, undefined, LOG_CONTEXT);
      });
    });
  });
});
