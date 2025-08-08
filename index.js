/**
 * Firebase Functions v2 Entry Point
 * Clean setup for NestJS application
 */

const { onRequest } = require('firebase-functions/v2/https');
const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const express = require('express');

// Import your NestJS app module
const { AppModule } = require('./dist/src/app.module');

// Create Express server
const server = express();

// Global app instance
let app;

/**
 * Initialize NestJS application
 */
async function createNestApp() {
  if (!app) {
    // Create NestJS app with Express adapter
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Setup Swagger
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Risha Backend Application')
      .setDescription('Risha Backend Application - Pigeon Management System')
      .setVersion('1.0')
      .addBearerAuth({ in: 'header', type: 'http' })
      .addServer('/', 'Firebase Functions')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, swaggerDocument);

    // Initialize the app
    await app.init();

    console.log('✅ NestJS app initialized successfully with Swagger');
  }
  return app;
}

/**
 * Firebase Functions v2 HTTP function
 */
exports.api = onRequest(async (req, res) => {
  try {
    console.log(`🚀 Request: ${req.method} ${req.url}`);

    // Initialize NestJS app if not already done
    await createNestApp();

    // Handle the request
    server(req, res);
  } catch (error) {
    console.error('❌ Error in Firebase function:', error);
    console.error('❌ Stack trace:', error.stack);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
});
