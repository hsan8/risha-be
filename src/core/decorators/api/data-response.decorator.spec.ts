const apiExtraModelsMock = jest.fn();
const apiResponseMock = jest.fn();
const getSchemaPathMock = jest.fn();
jest.mock('@nestjs/swagger', () => ({
  ApiExtraModels: apiExtraModelsMock,
  ApiResponse: apiResponseMock,
  getSchemaPath: getSchemaPathMock,
}));

import { HttpStatus } from '@nestjs/common';
import { ApiDataResponse } from './data-response.decorator';

class MockModel {}

describe('ApiDataResponse', () => {
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
    ])('should return ApiDataResponse decorator with proper settings', ({ passedStatus, expectedStatus }) => {
      const modelSchemaPathMock = 'model-path';
      getSchemaPathMock.mockReturnValueOnce(modelSchemaPathMock);

      ApiDataResponse(MockModel, passedStatus);

      expect(apiExtraModelsMock).toHaveBeenCalledWith(MockModel);
      expect(getSchemaPathMock).toHaveBeenCalledWith(MockModel);
      expect(apiResponseMock).toHaveBeenCalledWith({
        status: expectedStatus,
        description: 'Successful single item response',
        schema: {
          properties: {
            data: { $ref: modelSchemaPathMock },
          },
        },
      });
    });
  });

  describe('Primitive responses', () => {
    it('should return ApiDataResponse decorator with proper settings', () => {
      ApiDataResponse('boolean');

      expect(apiExtraModelsMock).not.toHaveBeenCalled();
      expect(getSchemaPathMock).not.toHaveBeenCalled();
      expect(apiResponseMock).toHaveBeenCalledWith({
        status: HttpStatus.OK,
        description: 'Successful single item response',
        schema: {
          properties: {
            data: { type: 'boolean' },
          },
        },
      });
    });
  });
});
