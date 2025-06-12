import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiProduces } from '@nestjs/swagger';

export const ApiFileResponse = () => {
  return applyDecorators(
    ApiProduces('application/octet-stream'),
    ApiOkResponse({
      description: 'Successfully returned file',
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
  );
};
