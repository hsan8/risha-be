import { Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

const logger = new Logger('FirebaseSetup');

const CONFIG_FILE_PATH = join(__dirname, '..', 'src', 'config', 'firebase-service-account.json');

if (existsSync(CONFIG_FILE_PATH)) {
  logger.warn('Firebase service account config file already exists.');
  process.exit(0);
}
