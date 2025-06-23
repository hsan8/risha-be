import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiProduces, ApiResponse } from '@nestjs/swagger';

export function ApiDataFileResponse(mimeTypes: string | string[], status = HttpStatus.OK) {
  const types = Array.isArray(mimeTypes) ? mimeTypes : [mimeTypes];

  return applyDecorators(
    ApiResponse({
      status,
      description: 'Successful file response',
      schema: {
        type: 'file',
        format: 'binary',
      },
    }),
    ApiProduces(...types),
  );
}
