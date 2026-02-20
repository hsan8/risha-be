import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractHttpAdapter, NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AppModule } from './app.module';

export async function createApp(httpAdapter?: AbstractHttpAdapter) {
  const app = httpAdapter
    ? await NestFactory.create(AppModule, httpAdapter, { bufferLogs: true })
    : await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors({
    origin: true,
    credentials: true,
  });

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
    .addServer('http://localhost:5001') // Add local development server
    .addServer('/risha-ef11e/us-central1/api') // Add Firebase Functions base path
    .build();

  return SwaggerModule.createDocument(app, swaggerConfig);
}

export async function bootstrap(app: INestApplication, swaggerDocument: OpenAPIObject) {
  const config = app.get(ConfigService);

  // Set up Swagger JSON endpoint
  app.use('/api-docs-json', (_req: Request, res: Response) => {
    res.json(swaggerDocument);
  });

  SwaggerModule.setup(config.getOrThrow<string>('SWAGGER_API_DOCS_PATH'), app, swaggerDocument);

  await app.startAllMicroservices();
  const FIREBASE_FUNCTIONS_PORT = 5001;
  await app.listen(FIREBASE_FUNCTIONS_PORT);
}
