import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { LANGUAGE_HEADER_NAME } from '../../constants';
import { UserLocale } from '../../enums';

/**
 * Define language request header 'Accept-Language' in api endpoint
 */
export const ApiLangRequestHeader = () => {
  return applyDecorators(
    ApiHeader({
      name: LANGUAGE_HEADER_NAME,
      schema: {
        enum: Object.values(UserLocale),
        default: UserLocale.ENGLISH,
        example: UserLocale.ARABIC,
      },
    }),
  );
};
