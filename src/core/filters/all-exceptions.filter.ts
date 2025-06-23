import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response as ExpressResponse } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { throwError } from 'rxjs';
import { ErrorCategory } from '../enums';
import { CustomRpcException } from '../exceptions';
import { IFieldError } from '../interfaces';
import { I18nContextWrapper, ResponseFactory } from '../utils';

const HTTP_STATUS_UNKNOWN_SUCCESS = 210;
const KNOWN_HTTP_EXCEPTION_CATEGORIES: { [_: number]: ErrorCategory } = {
  [HttpStatus.UNAUTHORIZED]: ErrorCategory.UNAUTHORIZED_ERROR,
  [HttpStatus.FORBIDDEN]: ErrorCategory.FORBIDDEN_ERROR,
  [HttpStatus.NOT_FOUND]: ErrorCategory.NOT_FOUND_ERROR,
  [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorCategory.INTERNAL_SERVER_ERROR,
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception);

    // Exception in RPC context
    if (host.getType() === 'rpc') {
      return throwError(() => new CustomRpcException(exception));
    }

    // Exception in HTTP context
    const httpCtx: HttpArgumentsHost = host.switchToHttp();
    const res = httpCtx.getResponse<ExpressResponse>();
    const i18n = new I18nContextWrapper(I18nContext.current());

    try {
      // Health check details special case
      if (host.switchToHttp().getRequest().originalUrl === '/health/details') {
        return res.status(HTTP_STATUS_UNKNOWN_SUCCESS).json(exception.response);
      }

      const status = this.extractStatusCode(exception);

      // Known categories (default errors, e.g. not found, unauthorized, ...)
      const knownCategory = KNOWN_HTTP_EXCEPTION_CATEGORIES[`${status}`];

      const errors = Array.isArray(exception.response?.errors || exception.rpcError?.errors)
        ? exception.response?.errors || exception.rpcError?.errors
        : [];
      const resErrors = errors.map(
        (error: IFieldError) => ({ field: error.field, message: i18n.t(error.message) } as IFieldError),
      );

      if (knownCategory) {
        const category = exception.response?.category || knownCategory;
        const message = i18n.ts(exception.response?.message, knownCategory);

        return res.status(status).json(ResponseFactory.error(category, message));
      }

      // Unknown Exception
      const category = exception.response?.category || ErrorCategory.UNHANDLED_ERROR;
      const message = this.extractMessage(exception);

      const resMessage = i18n.t(message);
      const resCategory = resMessage?.toString().includes('JSON') // Request body parsing error
        ? ErrorCategory.VALIDATION_ERROR
        : category;

      return res.status(status).json(ResponseFactory.error(resCategory, resMessage, resErrors));
    } catch (err) {
      // Fallback
      this.logger.error(err);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ResponseFactory.error(ErrorCategory.INTERNAL_SERVER_ERROR, i18n.t(ErrorCategory.INTERNAL_SERVER_ERROR)));
    }
  }

  private extractStatusCode(exception: any): number {
    return +(
      exception.getStatus?.() || // NestJS HttpException
      exception.rpcError?.status || // RPC
      exception.response?.status ||
      exception.response?.statusCode ||
      exception.rpcError?.status || // RPC wrapped status
      exception.status ||
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  private extractMessage(exception: any): any {
    const messages = [
      exception.rpcError?.message, // RPC exception
      exception.response?.data?.data?.error, // Keycloak
      exception.response?.data?.error, // Keycloak
      exception.response?.data?.errorMessage,
      exception.response?.message, // NestJS HttpException
      exception.response?.error,
      exception.rpcError?.message, // RPC wrapped message
      exception.message,
    ];

    for (const message of messages) {
      if (message !== undefined) return message; // will accept falsy values except undefined (e.g. null, '', 0, ...)
    }

    return undefined;
  }
}
