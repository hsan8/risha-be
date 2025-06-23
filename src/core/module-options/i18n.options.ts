import { AcceptLanguageResolver, I18nJsonLoader, I18nOptions, QueryResolver } from 'nestjs-i18n';
import path from 'path';

const LANG_QUERY_PARAM = 'lang';
const baseI18nDir = path.join(__dirname, '..', '..', '..', 'i18n');

export function buildI18nOptions(): I18nOptions {
  return {
    fallbackLanguage: 'en',
    loaderOptions: {
      path: baseI18nDir,
    },
    loader: I18nJsonLoader,
    resolvers: [new AcceptLanguageResolver({ matchType: 'strict' }), new QueryResolver([LANG_QUERY_PARAM])],
  };
}
