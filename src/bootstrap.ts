import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AbstractHttpAdapter } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_PORT = 3000;

export async function createApp(httpAdapter?: AbstractHttpAdapter) {
  const app = httpAdapter
    ? await NestFactory.create(AppModule, httpAdapter, { bufferLogs: true })
    : await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors();

  return app;
}

/**
 * Creates the swagger document.
 */
export function createSwaggerDocument(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Risha Backend Application')
    .setDescription('Risha Backend Application')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .addServer('/risha-ef11e/us-central1/api') // Add Firebase Functions base path
    .build();

  return SwaggerModule.createDocument(app, swaggerConfig);
}

export async function bootstrap(app: INestApplication, swaggerDocument: OpenAPIObject) {
  const config = app.get(ConfigService);

  // Set up Swagger JSON endpoint
  app.use('/api-docs-json', (req, res) => {
    res.json(swaggerDocument);
  });

  SwaggerModule.setup(config.getOrThrow<string>('SWAGGER_API_DOCS_PATH'), app, swaggerDocument);

  await app.startAllMicroservices();
  await app.listen(config.get<number>('PORT', DEFAULT_PORT));
}
