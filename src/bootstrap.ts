import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

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
    .build();

  return SwaggerModule.createDocument(app, swaggerConfig);
}

export async function bootstrap(app: INestApplication, swaggerDocument: OpenAPIObject) {
  const config = app.get(ConfigService);

  SwaggerModule.setup(config.getOrThrow<string>('SWAGGER_API_DOCS_PATH'), app, swaggerDocument);

  await app.startAllMicroservices();
  await app.listen(config.getOrThrow<number>('PORT'));
}
