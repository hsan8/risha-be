import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ExceptionResponse } from '../interfaces';

export const ApiSingleUnauthorized = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: properties.message as string,
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: properties.statusCode },
          error: { type: 'string', example: properties.error },
          message: {
            type: 'string',
            items: { type: 'string' },
            example: properties.message,
          },
        },
      },
    }),
  );
};

const properties: ExceptionResponse = {
  statusCode: HttpStatus.UNAUTHORIZED,
  error: 'UNAUTHORIZED',
  message: 'You are not authorized to access this resource.',
};
