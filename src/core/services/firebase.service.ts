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

      const databaseURL = 'https://risha-ef11e-default-rtdb.europe-west1.firebasedatabase.app/';
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');

      // Load service account from environment variables
      const serviceAccount = {
        type: 'service_account',
        project_id: projectId,
        private_key_id: this.configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
        private_key: this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        client_email: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        client_id: this.configService.get<string>('FIREBASE_CLIENT_ID'),
        auth_uri: this.configService.get<string>('FIREBASE_AUTH_URI'),
        token_uri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
        auth_provider_x509_cert_url: this.configService.get<string>('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
        client_x509_cert_url: this.configService.get<string>('FIREBASE_CLIENT_X509_CERT_URL'),
        universe_domain: this.configService.get<string>('FIREBASE_UNIVERSE_DOMAIN'),
      };

      this.logger.log('Firebase configuration:', {
        databaseURL,
        projectId,
      });

      // Initialize with service account credentials
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL,
        projectId,
      });

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
