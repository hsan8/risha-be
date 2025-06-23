import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiProperty } from '@nestjs/swagger';
import { ErrorCategory } from '../../enums';
import { IFieldError, IResponseError } from '../../interfaces';

/**
 * Define forbidden (403) response in api endpoint
 */
export const ApiForbiddenResponseBody = () => {
  return applyDecorators(ApiForbiddenResponse({ type: ForbiddenError }));
};

class ForbiddenError implements IResponseError {
  @ApiProperty({ example: ErrorCategory.FORBIDDEN_ERROR })
  category!: ErrorCategory;

  @ApiProperty({ example: 'Do not have permission to do this action' })
  message!: string;

  @ApiProperty({ example: [] })
  errors!: IFieldError[];
}
