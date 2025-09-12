import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { Database } from 'firebase-admin/database';
import { getFunctions } from 'firebase-admin/functions';

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
      // Force clear any emulator environment variables
      delete process.env.FIREBASE_DATABASE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
      delete process.env.FIREBASE_FIRESTORE_EMULATOR_HOST;
      delete process.env.GCLOUD_PROJECT;

      this.logger.log('Cleared emulator environment variables');

      // Check if Firebase is already initialized
      try {
        this.app = admin.app();
        this.database = admin.database();
        this.logger.log('Using existing Firebase app');
        return;
      } catch (e) {
        // App doesn't exist, continue with initialization
      }

      const databaseURL =
        this.configService.get<string>('FB_DATABASE_URL') ||
        'https://risha-ef11e-default-rtdb.europe-west1.firebasedatabase.app/';
      const projectId = this.configService.get<string>('FB_PROJECT_ID') || process.env.GCLOUD_PROJECT;

      const isRunningOnGcp = Boolean(
        process.env.K_SERVICE || // Cloud Run
          process.env.FUNCTION_TARGET || // Cloud Functions
          process.env.GOOGLE_CLOUD_PROJECT,
      );

      const appOptions: admin.AppOptions = { projectId, databaseURL };

      if (isRunningOnGcp) {
        // On GCP, use Application Default Credentials automatically
        this.logger.log('Initializing Firebase app using ADC on GCP');
      } else {
        // Local/dev: use service account file if provided for explicit creds, else ADC
        const serviceAccountPath = this.configService.get<string>('FB_SERVICE_ACCOUNT');
        if (serviceAccountPath) {
          try {
            // Resolve path relative to project root
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const serviceAccount = require(require('path').join(process.cwd(), serviceAccountPath));
            appOptions.credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
            this.logger.log('Initializing Firebase app with local service account file');
          } catch (e) {
            this.logger.warn(
              `Failed to load service account at ${serviceAccountPath}, falling back to ADC: ${e.message}`,
            );
            appOptions.credential = admin.credential.applicationDefault();
          }
        } else {
          appOptions.credential = admin.credential.applicationDefault();
          this.logger.log('Initializing Firebase app using local ADC');
        }
      }

      this.app = admin.initializeApp(appOptions);

      this.logger.log('Firebase app initialized successfully');

      // Initialize database
      this.database = admin.database(this.app);
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
