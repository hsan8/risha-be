const apiHeaderMock = jest.fn();
jest.mock('@nestjs/swagger', () => ({ ApiHeader: apiHeaderMock }));

import { LANGUAGE_HEADER_NAME } from '~/core/constants';
import { UserLocale } from '~/core/enums';
import { ApiLangRequestHeader } from './lang-request-header.decorator';

describe('ApiLangRequestHeader', () => {
  it('should return api header decorator with proper settings', () => {
    ApiLangRequestHeader();

    expect(apiHeaderMock).toHaveBeenCalledWith({
      name: LANGUAGE_HEADER_NAME,
      schema: {
        enum: Object.values(UserLocale),
        default: UserLocale.ENGLISH,
        example: UserLocale.ARABIC,
      },
    });
  });
});
