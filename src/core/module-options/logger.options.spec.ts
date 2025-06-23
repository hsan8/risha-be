/* eslint-disable prefer-const */
const randomUUIDMock = jest.fn();
const randomBytesMock = jest.fn();
jest.mock('crypto', () => ({ randomUUID: randomUUIDMock, randomBytes: randomBytesMock }));

import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage, ServerResponse } from 'http';
import { Options as PinoHttpOptions } from 'pino-http';
import URL, { UrlWithStringQuery } from 'url';
import { Environment } from '~/core/enums';
import { buildPinoOptions } from './logger.options';

describe('PinoOptions', () => {
  let configMock: DeepMocked<ConfigService>;
  let reqMock: DeepMocked<IncomingMessage>;
  let resMock: DeepMocked<ServerResponse>;

  let environment: Environment = Environment.DEV;
  let logLevel = 'debug';
  let logTimestamp = false;
  let logRequestBody = true;
  let logRequestHeaders = false;
  let maskLoggedSensitiveData = false;
  let quietReqLogger = false;

  const headersMock = {
    'accept-language': 'ar',
    authorization: '123',
    'x-internal-token': 'abc',
    'x-firebase-appcheck': 'xyz',
  };
  const MASK = '**********';

  beforeEach(() => {
    reqMock = createMock<IncomingMessage>();
    resMock = createMock<ServerResponse>();
    configMock = createMock<ConfigService>({
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'NODE_ENV':
            return environment;
          case 'LOG_LEVEL':
            return logLevel;
          case 'LOG_TIMESTAMP':
            return logTimestamp;
          case 'LOG_REQUEST_BODY':
            return logRequestBody;
          case 'LOG_REQUEST_HEADERS':
            return logRequestHeaders;
          case 'MASK_LOGGED_SENSITIVE_DATA':
            return maskLoggedSensitiveData;
          case 'QUIET_REQ_LOGGER':
            return quietReqLogger;
          default:
            throw new Error(`Unexpected key: ${key}`);
        }
      }),
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return correct PinoParams object', () => {
    // Run
    const options = buildPinoOptions(configMock);

    // Assert
    expect(options.exclude).toBeUndefined();
    expect(options.pinoHttp).toEqual({
      level: logLevel,
      safe: true,
      timestamp: expect.any(Function),
      quietReqLogger,
      transport: {
        target: 'pino-pretty',
        options: { singleLine: true },
      },
      serializers: {
        req: expect.any(Function),
      },
      formatters: {
        level: expect.any(Function),
      },
      redact: {
        paths: [
          'req.headers',
          'err.req.headers',
          'req.headers.authorization',
          'err.req.headers.authorization',
          'req.headers.Authorization',
          'err.req.headers.Authorization',
          'req.headers["x-internal-token"]',
          'err.req.headers["x-internal-token"]',
          'req.headers["X-Internal-Token"]',
          'err.req.headers["X-Internal-Token"]',
          'req.headers.cookie',
          'err.req.headers.cookie',
          'req.headers.Cookie',
          'err.req.headers.Cookie',
          'req.headers["x-firebase-appcheck"]',
          'err.req.headers["x-firebase-appcheck"]',
          'req.headers["X-Firebase-AppCheck"]',
          'err.req.headers["X-Firebase-AppCheck"]',
          'res.headers["set-cookie"]',
          'err.res.headers["set-cookie"]',
          'res.headers["Set-Cookie"]',
          'err.res.headers["Set-Cookie"]',
          'config.headers.authorization',
          'err.config.headers.authorization',
          'config.headers.Authorization',
          'err.config.headers.Authorization',
          'config.headers["x-internal-token"]',
          'err.config.headers["x-internal-token"]',
          'config.headers["X-Internal-Token"]',
          'err.config.headers["X-Internal-Token"]',
          'config.headers.cookie',
          'err.config.headers.cookie',
          'config.headers.Cookie',
          'err.config.headers.Cookie',
          'config.headers["api-key"]',
          'err.config.headers["api-key"]',
          'config.headers["Api-Key"]',
          'err.config.headers["Api-Key"]',
          'config.data',
          'err.config.data',
          'config.httpAgent',
          'err.config.httpAgent',
          'config.httpsAgent',
          'err.config.httpsAgent',
        ],
        censor: expect.any(Function),
      },
      autoLogging: {
        ignore: expect.any(Function),
      },
      customProps: expect.any(Function),
      customLogLevel: expect.any(Function),
      genReqId: expect.any(Function),
    });
  });

  describe('timestamp', () => {
    it('should return no time if it is not needed', () => {
      // Setup
      logTimestamp = false;

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const timestampFn = pinoHttp.timestamp as () => string;

      // Assert
      expect(timestampFn()).toEqual('');
    });

    it('should return time if needed', () => {
      // Setup
      logTimestamp = true;
      const date = new Date();
      jest.setSystemTime(date);

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const timestampFn = pinoHttp.timestamp as () => string;

      // Assert
      expect(timestampFn()).toEqual(`,"time":"${date.toISOString()}"`);
    });
  });

  describe('transport', () => {
    it('should return undefined transport when environment is not DEV', () => {
      // Setup
      environment = Environment.PROD;

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;

      // Assert
      expect(pinoHttp).toBeDefined();
      expect(pinoHttp.transport).toBeUndefined();
    });
  });

  describe('serializers', () => {
    describe('given `LOG_REQUEST_BODY` env var is false', () => {
      it('should not update the req serializer to include the req body', () => {
        // Setup
        logRequestBody = false;

        // Run
        const options = buildPinoOptions(configMock);
        const pinoHttp = options.pinoHttp as PinoHttpOptions;
        const req = pinoHttp.serializers?.req({ raw: { body: 'test' } });

        // Assert
        expect(req.body).toBeUndefined();
      });
    });

    describe('given `LOG_REQUEST_BODY` env var is true', () => {
      it('should not update the req serializer to include the req body', () => {
        // Setup
        logRequestBody = true;

        // Run
        const options = buildPinoOptions(configMock);
        const pinoHttp = options.pinoHttp as PinoHttpOptions;
        const req = pinoHttp.serializers?.req({ raw: { body: 'test' } });

        // Assert
        expect(req.body).toEqual('test');
      });
    });
  });

  describe('formatter', () => {
    it('should log the level as labels', () => {
      // Setup
      logRequestBody = false;

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const level = pinoHttp.formatters?.level?.('warn', 40);

      // Assert
      expect(level).toEqual({ level: 'WARN' });
    });
  });

  describe('redact', () => {
    describe('given the path is request headers', () => {
      describe('and `LOG_REQUEST_HEADERS` env var is false', () => {
        it('should not log the value', () => {
          logRequestHeaders = false;

          // Run
          const options = buildPinoOptions(configMock);
          const pinoHttp = options.pinoHttp as PinoHttpOptions;
          const val = (pinoHttp.redact as any).censor(headersMock, ['req', 'headers']);

          // Assert
          expect(val).toBeUndefined();
        });
      });

      describe('and `LOG_REQUEST_HEADERS` env var is true', () => {
        it('should log the value', () => {
          // Setup
          logRequestHeaders = true;

          // Run
          const options = buildPinoOptions(configMock);
          const pinoHttp = options.pinoHttp as PinoHttpOptions;
          const val = (pinoHttp.redact as any).censor(headersMock, ['req', 'headers']);

          // Assert
          expect(val).toEqual(headersMock);
        });

        describe('and `MASK_LOGGED_SENSITIVE_DATA` env var is false', () => {
          it('should log the value as unmasked value', () => {
            // Setup
            logRequestHeaders = true;
            maskLoggedSensitiveData = false;

            // Run
            const options = buildPinoOptions(configMock);
            const pinoHttp = options.pinoHttp as PinoHttpOptions;
            const val = (pinoHttp.redact as any).censor('ar', ['req', 'headers', 'accept-language']);

            // Assert
            expect(val).toEqual('ar');
          });
        });

        describe('and `MASK_LOGGED_SENSITIVE_DATA` env var is true', () => {
          it('should log "authorization" and "x-internal-token" values as masked values if present', () => {
            // Setup
            logRequestHeaders = true;
            maskLoggedSensitiveData = true;

            // Run
            const options = buildPinoOptions(configMock);
            const pinoHttp = options.pinoHttp as PinoHttpOptions;
            const val1 = (pinoHttp.redact as any).censor('123', ['req', 'headers', 'authorization']);
            const val2 = (pinoHttp.redact as any).censor('123', ['req', 'headers', 'x-internal-token']);

            // Assert
            expect(val1).toEqual(MASK);
            expect(val2).toEqual(MASK);
          });
        });
      });
    });

    describe('given the path is config headers', () => {
      const path = ['config', 'headers', 'Authorization'];

      describe('and `MASK_LOGGED_SENSITIVE_DATA` env var is true', () => {
        it('should log the value as masked value', () => {
          // Setup
          maskLoggedSensitiveData = true;

          // Run
          const options = buildPinoOptions(configMock);
          const pinoHttp = options.pinoHttp as PinoHttpOptions;
          const val = (pinoHttp.redact as any).censor('abc', path);

          // Assert
          expect(val).toEqual(MASK);
        });
      });
    });

    describe('given the path is config data', () => {
      const path = ['config', 'data'];

      describe('and `MASK_LOGGED_SENSITIVE_DATA` env var is true', () => {
        it('should log the value as masked value', () => {
          // Setup
          maskLoggedSensitiveData = true;

          // Run
          const options = buildPinoOptions(configMock);
          const pinoHttp = options.pinoHttp as PinoHttpOptions;
          const val = (pinoHttp.redact as any).censor('abc', path);

          // Assert
          expect(val).toEqual(MASK);
        });
      });
    });
  });

  describe('autoLogging', () => {
    it.each([
      { url: '/health' },
      { url: '/health?v=123' },
      { url: '/Health/details' },
      { url: '/health/details?v=123' },
      { url: '/Metrics' },
      { url: '/metrics?v=123' },
    ])('should ignore auto logging for $url', ({ url }) => {
      const req = createMock<IncomingMessage>({ url });

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const ignore = (pinoHttp.autoLogging as any).ignore;

      // Assert
      expect(ignore(req)).toEqual(true);
    });

    it.each([{ url: '/test' }, { url: undefined }])('should NOT ignore auto logging for $url', ({ url }) => {
      const req = createMock<IncomingMessage>({ url });

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const ignore = (pinoHttp.autoLogging as any).ignore;

      // Assert
      expect(ignore(req)).toEqual(false);
    });

    it('should ignore auto logging for non-parsable urls', () => {
      const mockParsedUrl = createMock<UrlWithStringQuery>({ pathname: null });
      jest.spyOn(URL, 'parse').mockReturnValueOnce(mockParsedUrl);
      const req = createMock<IncomingMessage>({ url: '/abc' });

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const ignore = (pinoHttp.autoLogging as any).ignore;

      // Assert
      expect(ignore(req)).toEqual(false);
    });
  });

  describe('customProps', () => {
    it('should return custom props', () => {
      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const props = pinoHttp.customProps?.(reqMock, resMock);

      // Assert
      expect(props).toEqual({ context: 'HTTP' });
    });
  });

  describe('customLogLevel', () => {
    it.each([
      { expected: 'info', statusCategory: '2xx', statusCode: HttpStatus.OK },
      { expected: 'silent', statusCategory: '3xx', statusCode: HttpStatus.TEMPORARY_REDIRECT },
      { expected: 'warn', statusCategory: '4xx', statusCode: HttpStatus.BAD_REQUEST },
      { expected: 'error', statusCategory: '5xx', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
    ])('should return "$expected" in case of $statusCategory responses', ({ expected, statusCode }) => {
      // Setup
      resMock = createMock<ServerResponse>({ statusCode });

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const level = pinoHttp.customLogLevel?.(reqMock, resMock);

      // Assert
      expect(level).toEqual(expected);
    });

    it('should return `error` in case of error', () => {
      // Setup
      resMock = createMock<ServerResponse>({ statusCode: 200 });

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const level = pinoHttp.customLogLevel?.(reqMock, resMock, new Error());

      // Assert
      expect(level).toEqual('error');
    });
  });

  describe('genReqId', () => {
    it('should return the req id if presents', () => {
      // Setup
      randomBytesMock.mockReturnValue('12345');
      reqMock = createMock<IncomingMessage>({ id: 'abc' });

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const reqId = pinoHttp.genReqId?.(reqMock, resMock);

      // Assert
      expect(reqId).toEqual('12345-abc');
      expect(reqMock.headers['x-request-id']).toEqual(reqId);
      expect(resMock.setHeader).toHaveBeenCalledWith('X-Request-Id', reqId);
    });

    it('should return "x-request-id" header value if req id does not present', () => {
      // Setup
      randomBytesMock.mockReturnValue('12345');
      reqMock = createMock<IncomingMessage>({
        id: undefined,
        headers: { 'x-request-id': 'abc' },
      });

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const reqId = pinoHttp.genReqId?.(reqMock, resMock);

      // Assert
      expect(reqId).toEqual('12345-abc');
      expect(reqMock.headers['x-request-id']).toEqual(reqId);
      expect(resMock.setHeader).toHaveBeenCalledWith('X-Request-Id', reqId);
    });

    it('should return a random uuid if req id and "x-request-id" are not in the req', () => {
      // Setup
      randomUUIDMock.mockReturnValue('abc');
      randomBytesMock.mockReturnValue('12345');
      reqMock = createMock<IncomingMessage>({
        id: undefined,
        headers: {},
      });

      // Run
      const options = buildPinoOptions(configMock);
      const pinoHttp = options.pinoHttp as PinoHttpOptions;
      const reqId = pinoHttp.genReqId?.(reqMock, resMock);

      // Assert
      expect(reqId).toEqual('12345-abc');
      expect(randomUUIDMock).toHaveBeenCalledTimes(1);
      expect(reqMock.headers['x-request-id']).toEqual(reqId);
      expect(resMock.setHeader).toHaveBeenCalledWith('X-Request-Id', reqId);
    });
  });
});
