import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

export const api = functions.https.onRequest(async (req, res) => {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
});
