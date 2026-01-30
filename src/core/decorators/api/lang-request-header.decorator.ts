import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { LANGUAGE_HEADER_NAME, X_LANGUAGE_HEADER } from '../../constants';
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
        default: UserLocale.ARABIC,
        example: UserLocale.ARABIC,
      },
    }),
  );
};

/**
 * Define x-language request header for locale. Takes precedence over Accept-Language.
 * Supported: ar (default), en.
 */
export const ApiXLanguageHeader = () => {
  return applyDecorators(
    ApiHeader({
      name: X_LANGUAGE_HEADER,
      description: 'Preferred locale for responses (ar | en). Default: ar.',
      required: false,
      schema: {
        enum: Object.values(UserLocale),
        default: UserLocale.ARABIC,
        example: UserLocale.ARABIC,
      },
    }),
  );
};
