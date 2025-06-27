import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { Database } from 'firebase-admin/database';
import { getFunctions } from 'firebase-admin/functions';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private app: App;
  private database: Database;

  constructor(private readonly configService: ConfigService) {
    this.initializeApp();
  }

  private initializeApp(): void {
    try {
      // Check if Firebase is already initialized
      try {
        this.app = admin.app();
        this.database = admin.database();
        this.logger.log('Using existing Firebase app');
        return;
      } catch (e) {
        // App doesn't exist, continue with initialization
      }

      const serviceAccountPath = this.configService.get('FIREBASE_SERVICE_ACCOUNT');
      const databaseURL = this.configService.get('FIREBASE_DATABASE_URL');
      const projectId = this.configService.get('FIREBASE_PROJECT_ID');
      const isDevEnv = this.configService.get('NODE_ENV') === 'dev';

      this.logger.debug('Firebase configuration:', {
        serviceAccountPath,
        databaseURL,
        projectId,
        isDevEnv,
      });

      if (!serviceAccountPath || !databaseURL || !projectId) {
        throw new Error('Firebase configuration is missing');
      }

      // Load service account from file
      const serviceAccountFile = path.resolve(process.cwd(), serviceAccountPath);
      this.logger.debug('Attempting to load service account from:', serviceAccountFile);

      if (!fs.existsSync(serviceAccountFile)) {
        throw new Error(`Firebase service account file not found at: ${serviceAccountFile}`);
      }

      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountFile, 'utf8'));
      this.logger.debug('Service account loaded successfully');

      // Initialize the app with emulator settings in dev mode
      if (isDevEnv) {
        process.env.FIREBASE_AUTH_EMULATOR_HOST = this.configService.get('FIREBASE_AUTH_EMULATOR_HOST');
        process.env.FIREBASE_DATABASE_EMULATOR_HOST = this.configService.get('FIREBASE_DATABASE_EMULATOR_HOST');
        process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST = this.configService.get('FIREBASE_FUNCTIONS_EMULATOR_HOST');

        this.logger.log('Using Firebase emulators');
      }

      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL,
        projectId,
      });

      this.logger.log('Firebase app initialized successfully');

      this.database = admin.database(this.app);

      // Only use emulator in development
      if (isDevEnv) {
        const [host, port] = this.configService.get('FIREBASE_DATABASE_EMULATOR_HOST').split(':');
        this.database.useEmulator(host, parseInt(port, 10));
        this.logger.log(`Using Firebase database emulator at ${host}:${port}`);
      }

      this.logger.log('Firebase database initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase app', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  getDatabase(): Database {
    if (!this.database) {
      this.logger.error('Firebase database not initialized');
      throw new Error('Firebase database not initialized');
    }
    return this.database;
  }

  getFunctions() {
    return getFunctions(this.app);
  }
}
