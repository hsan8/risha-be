import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';
import { ExceptionResponse } from '../interfaces';

export const getStatusCode = <T>(exception: T): number => {
  return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = <T>(exception: T): string | string[] => {
  if (exception instanceof HttpException) {
    const response = exception.getResponse() as ExceptionResponse;
    return Array.isArray(response.message) ? response.message : [response.message];
  }
  return String(exception);
};

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IncomingMessage>();
    const statusCode = getStatusCode<T>(exception);
    const message = getErrorMessage<T>(exception);

    response.status(statusCode).json({
      error: {
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: Array.isArray(message) ? message : [message],
      },
    });
  }
}
