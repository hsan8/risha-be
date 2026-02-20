import { X_LANGUAGE_HEADER } from '@/core/constants';
import { DEFAULT_LOCALE, normalizeToSupportedLocale, UserLocale } from '@/core/enums';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

const LANG_QUERY = 'lang';

/**
 * Intercepts every request and resolves the language from (in order):
 * 1. x-language header
 * 2. Accept-Language header (first preferred language)
 * 3. query param ?lang=
 * Attaches the resolved locale to the request as request.language.
 * Default when none provided: Arabic (UserLocale.ARABIC).
 */
@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { language?: UserLocale }>();
    request.language = this.resolveLanguage(request);
    return next.handle();
  }

  private resolveLanguage(request: Request): UserLocale {
    const xLang = request.get?.(X_LANGUAGE_HEADER);
    if (xLang) return normalizeToSupportedLocale(xLang);

    const acceptLang = request.get?.('accept-language');
    if (acceptLang) {
      const first = acceptLang.split(',')[0]?.trim?.().split('-')[0];
      if (first) return normalizeToSupportedLocale(first);
    }

    const queryLang = typeof request.query?.[LANG_QUERY] === 'string' ? request.query[LANG_QUERY] : undefined;
    if (queryLang) return normalizeToSupportedLocale(queryLang);

    return DEFAULT_LOCALE;
  }
}
