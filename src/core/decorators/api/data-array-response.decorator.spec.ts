const apiExtraModelsMock = jest.fn();
const apiResponseMock = jest.fn();
const getSchemaPathMock = jest.fn();
jest.mock('@nestjs/swagger', () => ({
  ApiExtraModels: apiExtraModelsMock,
  ApiResponse: apiResponseMock,
  getSchemaPath: getSchemaPathMock,
}));

import { HttpStatus } from '@nestjs/common';
import { ApiDataArrayResponse } from './data-array-response.decorator';

class MockModel {}

describe('ApiDataArrayResponse', () => {
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
    ])('should return ApiDataArrayResponse decorator with proper settings', ({ passedStatus, expectedStatus }) => {
      const modelSchemaPathMock = 'model-path';
      getSchemaPathMock.mockReturnValueOnce(modelSchemaPathMock);

      ApiDataArrayResponse(MockModel, passedStatus);

      expect(apiExtraModelsMock).toHaveBeenCalledWith(MockModel);
      expect(getSchemaPathMock).toHaveBeenCalledWith(MockModel);
      expect(apiResponseMock).toHaveBeenCalledWith({
        status: expectedStatus,
        description: 'Successful list response',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: modelSchemaPathMock },
            },
          },
        },
      });
    });
  });

  describe('Primitive responses', () => {
    it('should return ApiDataArrayResponse decorator with proper settings', () => {
      ApiDataArrayResponse('boolean');

      expect(apiExtraModelsMock).not.toHaveBeenCalled();
      expect(getSchemaPathMock).not.toHaveBeenCalled();
      expect(apiResponseMock).toHaveBeenCalledWith({
        status: HttpStatus.OK,
        description: 'Successful list response',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { type: 'boolean' },
            },
          },
        },
      });
    });
  });
});
