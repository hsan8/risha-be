import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

const expressServer = express();
let app: INestApplication = null;

const createFunction = async (expressInstance): Promise<void> => {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));

    // Enable CORS
    app.enableCors();

    // Setup Swagger
    const config = new DocumentBuilder()
      .setTitle('Risha API')
      .setDescription('The Risha API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
      customSiteTitle: 'Risha API Documentation',
      customfavIcon: 'https://nestjs.com/img/logo_text.svg',
      customJs: ['https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js'],
      customCssUrl: ['https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css'],
    });

    await app.init();
  }
};

// Export the Firebase function
export const api = functions.https.onRequest(async (request, response) => {
  if (!app) {
    await createFunction(expressServer);
  }
  expressServer(request, response);
});
