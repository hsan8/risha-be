import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { I18nMiddleware } from 'nestjs-i18n';

/**
 * Used to register global middlewares.
 *
 * The motivation for creating a separate module is to register the logging module (which register its own middleware)
 * first before any other middleware.
 */
@Module({})
export class MiddlewaresModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nMiddleware).forRoutes('*');
  }
}
