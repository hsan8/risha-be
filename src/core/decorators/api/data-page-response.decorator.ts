import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { DataPageResponseDto } from '../../dtos';

/**
 * Define the response structure of the endpoint as a page of items response.
 * We can pass complex model type such as DTOs, or primitive names as strings (e.g. 'boolean').
 */
export const ApiDataPageResponse = <TModel extends Type>(model: TModel | string, status = HttpStatus.OK) => {
  const decorators = [];
  const modelProperties: { $ref?: string; type?: string } = {};

  if (typeof model !== 'string') {
    decorators.push(ApiExtraModels(DataPageResponseDto, model));
    modelProperties.$ref = getSchemaPath(model);
  } else {
    decorators.push(ApiExtraModels(DataPageResponseDto));
    modelProperties.type = model;
  }

  decorators.push(
    ApiResponse({
      status,
      description: 'Successful paginated list response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(DataPageResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: modelProperties,
              },
            },
          },
        ],
      },
    }),
  );

  return applyDecorators(...decorators);
};
