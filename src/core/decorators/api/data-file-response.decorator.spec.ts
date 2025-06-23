const apiProducesMock = jest.fn();
const apiResponseMock = jest.fn();
jest.mock('@nestjs/swagger', () => ({
  ApiProduces: apiProducesMock,
  ApiResponse: apiResponseMock,
}));

import { HttpStatus } from '@nestjs/common';
import { ApiDataFileResponse } from './data-file-response.decorator';

describe('ApiDataFileResponse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    {
      passedStatus: undefined,
      expectedStatus: HttpStatus.OK,
    },
    {
      passedStatus: HttpStatus.CREATED,
      expectedStatus: HttpStatus.CREATED,
    },
  ])('should return ApiDataFileResponse decorator with proper settings', ({ passedStatus, expectedStatus }) => {
    ApiDataFileResponse('image/*', passedStatus);

    expect(apiResponseMock).toHaveBeenCalledWith({
      status: expectedStatus,
      description: 'Successful file response',
      schema: {
        type: 'file',
        format: 'binary',
      },
    });
    expect(apiProducesMock).toHaveBeenCalledWith('image/*');
  });

  it('should return ApiDataFileResponse decorator with proper settings (multiple mime types)', () => {
    ApiDataFileResponse(['image/png', 'image/jpeg']);

    expect(apiResponseMock).toHaveBeenCalledWith({
      status: HttpStatus.OK,
      description: 'Successful file response',
      schema: {
        type: 'file',
        format: 'binary',
      },
    });
    expect(apiProducesMock).toHaveBeenCalledWith('image/png', 'image/jpeg');
  });
});
