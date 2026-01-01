import { createApp, createSwaggerDocument } from './src/bootstrap';
import { onRequest } from 'firebase-functions/v2/https';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { SwaggerModule } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

const server = express();
let isAppInitialized = false;

const initializeApp = async () => {
  if (!isAppInitialized) {
    const expressAdapter = new ExpressAdapter(server);
    const app = await createApp(expressAdapter);

    // Set up Swagger
    const document = createSwaggerDocument(app);
    SwaggerModule.setup('api-docs', app, document, {
      useGlobalPrefix: true,
      explorer: true,
      customSiteTitle: 'Risha API Documentation',
      customfavIcon: 'https://nestjs.com/img/logo_text.svg',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      ],
      swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: true,
        displayRequestDuration: true,
        filter: true,
        urls: [
          {
            url: '/risha-ef11e/us-central1/api/api-docs-json',
            name: 'Risha API',
          },
          {
            url: 'http://localhost:5001',
            name: 'Local Risha API',
          },
        ],
      },
    });

    await app.init();
    isAppInitialized = true;
  }
};

export const api = onRequest(async (request, response) => {
  try {
    await initializeApp();
    server(request, response);
  } catch (error) {
    console.error('Error:', error);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});
