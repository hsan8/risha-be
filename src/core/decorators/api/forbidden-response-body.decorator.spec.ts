const apiForbiddenResponseMock = jest.fn();
jest.mock('@nestjs/swagger', () => ({
  ApiForbiddenResponse: apiForbiddenResponseMock,
  ApiProperty: () => jest.fn(),
}));

import { ApiForbiddenResponseBody } from './forbidden-response-body.decorator';

describe('ApiForbiddenResponseBody', () => {
  it('should return api forbidden response decorator with proper settings', () => {
    ApiForbiddenResponseBody();

    expect(apiForbiddenResponseMock).toHaveBeenCalledWith({
      type: expect.any(Function),
    });
  });
});
