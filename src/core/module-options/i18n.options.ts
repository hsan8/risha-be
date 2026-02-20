import { X_LANGUAGE_HEADER } from '@/core/constants';
import { UserLocale } from '@/core/enums';
import { AcceptLanguageResolver, HeaderResolver, I18nJsonLoader, I18nOptions, QueryResolver } from 'nestjs-i18n';
import path from 'path';

const LANG_QUERY_PARAM = 'lang';
const baseI18nDir = path.join(__dirname, '..', '..', '..', 'i18n');

export function buildI18nOptions(): I18nOptions {
  return {
    fallbackLanguage: UserLocale.ARABIC,
    loaderOptions: {
      path: baseI18nDir,
    },
    loader: I18nJsonLoader,
    resolvers: [
      new HeaderResolver([X_LANGUAGE_HEADER]),
      new AcceptLanguageResolver({ matchType: 'strict' }),
      new QueryResolver([LANG_QUERY_PARAM]),
    ],
  };
}
