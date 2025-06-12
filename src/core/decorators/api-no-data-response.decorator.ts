import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export const ApiNoDataResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Operation successful, no data returned',
      schema: {},
    }),
  );
};
