import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ExceptionResponse } from '../interfaces';

const forbiddenProperties: ExceptionResponse = {
  statusCode: HttpStatus.FORBIDDEN,
  error: 'FORBIDDEN',
  message: 'You are not authorized to perform this action.',
};

export const ApiSingleForbidden = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: forbiddenProperties.message as string,
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: forbiddenProperties.statusCode },
          error: { type: 'string', example: forbiddenProperties.error },
          message: { type: 'string', example: forbiddenProperties.message },
        },
      },
    }),
  );
};
