import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorCategory } from '../../enums';
import { IFieldError, IResponseError } from '../../interfaces';

/**
 * Define unauthorized (401) response in api endpoint
 */
export const ApiUnauthorizedResponseBody = () => {
  return applyDecorators(ApiUnauthorizedResponse({ type: UnauthorizedError }));
};

class UnauthorizedError implements IResponseError {
  @ApiProperty({ example: ErrorCategory.UNAUTHORIZED_ERROR })
  category!: ErrorCategory;

  @ApiProperty({ example: 'You have to login again' })
  message!: string;

  @ApiProperty({ example: [] })
  errors!: IFieldError[];
}
