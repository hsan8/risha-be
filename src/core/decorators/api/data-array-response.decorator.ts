import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Define the response structure of the endpoint as a list of items response.
 * We can pass complex model type such as DTOs, or primitive names as strings (e.g. 'boolean').
 */
export const ApiDataArrayResponse = <TModel extends Type>(model: TModel | string, status = HttpStatus.OK) => {
  const decorators = [];
  const modelProperties: { $ref?: string; type?: string } = {};

  if (typeof model !== 'string') {
    decorators.push(ApiExtraModels(model));
    modelProperties.$ref = getSchemaPath(model);
  } else {
    modelProperties.type = model;
  }

  decorators.push(
    ApiResponse({
      status,
      description: 'Successful list response',
      schema: {
        properties: {
          data: {
            type: 'array',
            items: modelProperties,
          },
        },
      },
    }),
  );

  return applyDecorators(...decorators);
};
