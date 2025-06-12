import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters';

async function bootstrap() {
  // create the app
  const app = await NestFactory.create(AppModule);

  // configuration of the app
  const configService = app.get(ConfigService);
  /**
   * Enable versioning Should be called before swagger
   */
  // default api versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // swagger
  const config = new DocumentBuilder().setTitle('Microservice Template').build();
  const document = SwaggerModule.createDocument(app, config);
  // docs path is more meanful
  SwaggerModule.setup('docs', app, document);

  // global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // all global pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // security
  app.use(helmet());
  app.enableCors();

  // start the app
  // in deployment we PORT could be setted by the insfrastructure provider
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
