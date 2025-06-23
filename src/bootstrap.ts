import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { Environment } from './core/enums';

export async function createApp() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);

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

  // Swagger setup
  if (config.getOrThrow('NODE_ENV') === Environment.DEV) {
    SwaggerModule.setup(config.getOrThrow<string>('SWAGGER_API_DOCS_PATH'), app, swaggerDocument);
  }

  /*await app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        host: config.getOrThrow('MS_HOST'),
        port: +config.getOrThrow('MS_PORT'),
      },
    },
    { inheritAppConfig: true },
  );*/

  // Start app with its microservices
  await app.startAllMicroservices();
  await app.listen(config.getOrThrow<number>('PORT'));
}
