import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nContext,
  I18nModule as I18nModuleCore,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { UserLang } from '../enums';
import { RabbitMQHeaderResolver, SocketHeaderResolver } from './resolvers';

// TODO: refactor this module.
@Module({
  imports: [
    I18nModuleCore.forRootAsync({
      useFactory: () => {
        const logger = new Logger('I18nModule');
        logger.log(`Fallback language set to: ${UserLang.ENGLISH}`);

        const langPath = path.join(process.cwd(), 'src/core/i18n/lang/');
        logger.log(`Language files path: ${langPath}`);

        const typesOutputPath = path.join(process.cwd(), 'src/core/i18n/generated/i18n.generated.ts');
        logger.log(`Types output path: ${typesOutputPath}`);

        return {
          fallbackLanguage: UserLang.ENGLISH,
          loaderOptions: {
            path: langPath,
            watch: true,
          },
          typesOutputPath,
        };
      },
      resolvers: [
        new SocketHeaderResolver(['x-lang', 'x-language', 'language']),
        new RabbitMQHeaderResolver(['x-lang', 'x-language', 'language']),
        { use: QueryResolver, options: ['language'] },
        new HeaderResolver(['x-lang', 'x-language', 'language']),
        AcceptLanguageResolver, // must be the last one
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [I18nContext],
  exports: [I18nContext],
})
export class I18nModule {
  private readonly logger = new Logger(I18nModule.name);

  constructor() {
    this.logger.log('I18nModule initialized');
    this.logResolvers();
  }

  private logResolvers() {
    const resolvers = [
      'SocketHeaderResolver',
      'RabbitMQHeaderResolver',
      'QueryResolver',
      'HeaderResolver',
      'AcceptLanguageResolver',
    ];
    this.logger.log(`Configured resolvers: ${resolvers.join(', ')}`);
  }
}
