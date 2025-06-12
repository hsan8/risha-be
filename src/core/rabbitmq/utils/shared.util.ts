import { RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

/**
 * @returns A function to catch exception from microservice and throw it to client
 */
export const catchException = () =>
  catchError((error) => throwError(() => new RpcException(error?.response ?? error?.error)));
