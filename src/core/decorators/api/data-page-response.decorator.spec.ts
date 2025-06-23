const apiExtraModelsMock = jest.fn();
const apiResponseMock = jest.fn();
const getSchemaPathMock = jest.fn();
jest.mock('@nestjs/swagger', () => ({
  ApiExtraModels: apiExtraModelsMock,
  ApiResponse: apiResponseMock,
  getSchemaPath: getSchemaPathMock,
  ApiPropertyOptional: () => jest.fn(),
  ApiProperty: () => jest.fn(),
}));

import { HttpStatus } from '@nestjs/common';
import { DataPageResponseDto } from '~/core/dtos';
import { ApiDataPageResponse } from './data-page-response.decorator';

class MockModel {}

describe('ApiDataPageResponse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Model responses', () => {
    it.each([
      {
        passedStatus: undefined,
        expectedStatus: HttpStatus.OK,
      },
      {
        passedStatus: HttpStatus.CREATED,
        expectedStatus: HttpStatus.CREATED,
      },
    ])('should return ApiDataPageResponse decorator with proper settings', ({ passedStatus, expectedStatus }) => {
      const modelSchemaPathMock = 'model-path';
      getSchemaPathMock.mockReturnValueOnce(modelSchemaPathMock);
      const dataPageSchemaPathMock = 'data-page-path';
      getSchemaPathMock.mockReturnValueOnce(dataPageSchemaPathMock);

      ApiDataPageResponse(MockModel, passedStatus);

      expect(apiExtraModelsMock).toHaveBeenCalledWith(DataPageResponseDto, MockModel);
      expect(getSchemaPathMock).toHaveBeenCalledWith(DataPageResponseDto);
      expect(getSchemaPathMock).toHaveBeenCalledWith(MockModel);
      expect(apiResponseMock).toHaveBeenCalledWith({
        status: expectedStatus,
        description: 'Successful paginated list response',
        schema: {
          allOf: [
            { $ref: dataPageSchemaPathMock },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: modelSchemaPathMock },
                },
              },
            },
          ],
        },
      });
    });
  });

  describe('Primitive responses', () => {
    it('should return ApiDataPageResponse decorator with proper settings', () => {
      const dataPageSchemaPathMock = 'data-page-path';
      getSchemaPathMock.mockReturnValueOnce(dataPageSchemaPathMock);

      ApiDataPageResponse('boolean');

      expect(apiExtraModelsMock).toHaveBeenCalledWith(DataPageResponseDto);
      expect(getSchemaPathMock).toHaveBeenCalledWith(DataPageResponseDto);
      expect(apiResponseMock).toHaveBeenCalledWith({
        status: HttpStatus.OK,
        description: 'Successful paginated list response',
        schema: {
          allOf: [
            { $ref: dataPageSchemaPathMock },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { type: 'boolean' },
                },
              },
            },
          ],
        },
      });
    });
  });
});
