import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { X_LANGUAGE_HEADER } from '@/core/constants';
import { DEFAULT_LOCALE, normalizeToSupportedLocale, UserLocale } from '@/core/enums';

/** Alias for controller/service use; same as UserLocale */
export type ResolvedLocale = UserLocale;

type RequestWithLanguage = Request & { language?: UserLocale };

/**
 * Resolves the request language: request.language (set by LanguageInterceptor), then x-language
 * header, then I18nContext. Use in controllers to inject the current locale for localized messages.
 * Default when none provided: Arabic.
 */
export const Language = createParamDecorator((_data: unknown, ctx: ExecutionContext): UserLocale => {
  const request = ctx.switchToHttp().getRequest<RequestWithLanguage>();
  if (request.language) return request.language;

  const xLang = request.get(X_LANGUAGE_HEADER);
  if (xLang) return normalizeToSupportedLocale(xLang);

  const i18nLang = I18nContext.current()?.lang;
  if (i18nLang) return normalizeToSupportedLocale(String(i18nLang));

  return DEFAULT_LOCALE;
});
