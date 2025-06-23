const apiUnauthorizedResponseMock = jest.fn();
jest.mock('@nestjs/swagger', () => ({
  ApiUnauthorizedResponse: apiUnauthorizedResponseMock,
  ApiProperty: () => jest.fn(),
}));

import { ApiUnauthorizedResponseBody } from './unauthorized-response-body.decorator';

describe('ApiUnauthorizedResponseBody', () => {
  it('should return api unauthorized response decorator with proper settings', () => {
    ApiUnauthorizedResponseBody();

    expect(apiUnauthorizedResponseMock).toHaveBeenCalledWith({
      type: expect.any(Function),
    });
  });
});
