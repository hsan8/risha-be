import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, randomUUID } from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';
import { Params as PinoParams } from 'nestjs-pino';
import { Options as PinoHttpOptions } from 'pino-http';
import URL from 'url';
import { isTrue } from '../utils';

const MASK = '**********';
const REQ_ID_RANDOM_PREFIX_LENGTH = 5;

export function buildPinoOptions(config: ConfigService): PinoParams {
  const level = config.getOrThrow('LOG_LEVEL', 'info');
  const logRequestBody = isTrue(config.getOrThrow('LOG_REQUEST_BODY', false));
  const logRequestHeaders = isTrue(config.getOrThrow('LOG_REQUEST_HEADERS', true));
  const maskLoggedSensitiveData = isTrue(config.getOrThrow('MASK_LOGGED_SENSITIVE_DATA', true));

  // Base configuration without transport
  const pinoHttp: PinoHttpOptions = {
    level,
    enabled: true,
    timestamp: true,
    messageKey: 'message',
    formatters: {
      level: (label) => ({ level: label.toUpperCase() }),
    },
  };

  // Add common configuration for all environments
  Object.assign(pinoHttp, {
    serializers: {
      req: getRequestSerializer(logRequestBody),
    },
    redact: getRedactOptions(logRequestHeaders, maskLoggedSensitiveData),
    autoLogging: getAutoLoggingOptions(['/health', '/health/details', '/metrics']),
    customProps,
    customLogLevel,
    genReqId,
  });

  // Note: pino-pretty transport removed completely to avoid Firebase Functions issues

  return { pinoHttp };
}

/**
 * Customize the request log serializer to
 * - Include the request body if needed (e.g. for debugging purposes)
 */
function getRequestSerializer(logRequestBody: boolean) {
  return (req: any) => {
    if (logRequestBody) {
      req.body = req.raw.body;
    }
    return req;
  };
}

/**
 * Censor sensitive information in the logs, like authorization and token headers.
 */
function getRedactOptions(logRequestHeaders: boolean, maskLoggedSensitiveData: boolean): PinoHttpOptions['redact'] {
  const sensitiveFieldPaths = getLoggedFieldPaths([
    // to check if we need to ignore all headers
    'req.headers',

    // request auth headers
    'req.headers.authorization',
    'req.headers.Authorization',
    'req.headers["x-internal-token"]',
    'req.headers["X-Internal-Token"]',
    'req.headers.cookie',
    'req.headers.Cookie',
    'req.headers["x-firebase-appcheck"]',
    'req.headers["X-Firebase-AppCheck"]',

    // response auth headers
    'res.headers["set-cookie"]',
    'res.headers["Set-Cookie"]',

    // axios
    'config.headers.authorization',
    'config.headers.Authorization',
    'config.headers["x-internal-token"]',
    'config.headers["X-Internal-Token"]',
    'config.headers.cookie',
    'config.headers.Cookie',
    'config.headers["api-key"]',
    'config.headers["Api-Key"]',
    'config.data',
    'config.httpAgent',
    'config.httpsAgent',
  ]);

  return {
    paths: sensitiveFieldPaths,
    censor(value: any, path: string[]) {
      const joinedPath = path.join('.');

      // ignore request headers
      if (joinedPath === 'req.headers') {
        return logRequestHeaders ? value : undefined;
      }

      // censor sensitive information
      if (maskLoggedSensitiveData) {
        return MASK;
      }

      return value;
    },
  };
}

/**
 * Exclude specific endpoints from auto logging the request summary, useful to reduce the health endpoints call logs.
 * Meanwhile keep logging exception with request details if any.
 */
function getAutoLoggingOptions(ignoredPaths: string[]): PinoHttpOptions['autoLogging'] {
  return {
    ignore: (req: IncomingMessage) => {
      const endpointUrl = req.url ? URL.parse(req.url).pathname : ''; // pathname to avoid query params (e.g. `/health?v=1`)
      return ignoredPaths.some((path) => endpointUrl?.toLowerCase() === path.toLowerCase());
    },
  };
}

/**
 * Each logged filed might has variants (e.g. wrapped under "error" object).
 */
function getLoggedFieldPaths(keys: string[]) {
  return keys.flatMap((key) => [key, `err.${key}`]);
}

/**
 * Add custom properties to the logs.
 */
const customProps: PinoHttpOptions['customProps'] = (_req: IncomingMessage, _res: ServerResponse<IncomingMessage>) => {
  return { context: 'HTTP', timestamp: new Date().toISOString() };
};

/**
 * Log levels:
 * - 60: fatal
 * - 50: error
 * - 40: warn
 * - 30: info
 * - 20: debug
 * - 10: trace
 * - 0: silent
 */
const customLogLevel: PinoHttpOptions['customLogLevel'] = (
  _req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  error?: Error,
) => {
  if (res.statusCode >= HttpStatus.BAD_REQUEST && res.statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
    return 'warn';
  } else if (res.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR || error) {
    return 'error';
  } else if (res.statusCode >= HttpStatus.AMBIGUOUS && res.statusCode < HttpStatus.BAD_REQUEST) {
    return 'silent';
  }
  return 'info';
};

/**
 * Generate a unique request ID for each request if it doesn't exist.
 */
const genReqId: PinoHttpOptions['genReqId'] = (req: IncomingMessage, res: ServerResponse) => {
  const id = req.id?.toString() || req.headers['x-request-id'] || req.headers['X-Request-Id'] || randomUUID();
  const prefix = randomBytes(REQ_ID_RANDOM_PREFIX_LENGTH).toString('hex'); // to ensure deduplication

  const reqId = `${prefix}-${id}`;
  req.headers['x-request-id'] = reqId; // propagate the id to other components (e.g. audit)
  res.setHeader('X-Request-Id', reqId);

  return reqId;
};
