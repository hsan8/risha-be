import { AcceptLanguageResolver, I18nJsonLoader, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { buildI18nOptions } from './i18n.options';

describe('I18nOptions', () => {
  it('should have the expected options', () => {
    const options = buildI18nOptions();

    expect(options).toEqual({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '..', '..', 'i18n'),
      },
      loader: I18nJsonLoader,
      resolvers: [expect.anything(), expect.anything()],
    });
  });

  it('should have the correct resolvers', () => {
    const options = buildI18nOptions();
    const [acceptLanguageResolver, queryResolver] = options.resolvers || [];

    expect(options.resolvers).toHaveLength(2);
    expect(acceptLanguageResolver).toBeInstanceOf(AcceptLanguageResolver);
    expect(queryResolver).toBeInstanceOf(QueryResolver);
  });
});
