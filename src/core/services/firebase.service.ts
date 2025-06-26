import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { Database } from 'firebase-admin/database';
import { FIREBASE_CONSTANTS } from '../constants/firebase.constant';
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

      if (!serviceAccountPath || !databaseURL) {
        throw new Error('Firebase configuration is missing');
      }

      // Load service account from file
      const serviceAccountFile = path.resolve(process.cwd(), serviceAccountPath);
      if (!fs.existsSync(serviceAccountFile)) {
        throw new Error(`Firebase service account file not found at: ${serviceAccountFile}`);
      }

      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountFile, 'utf8'));

      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL,
      });

      this.logger.log('Firebase app initialized successfully');

      this.database = admin.database(this.app);

      // Only use emulator in development
      if (process.env.NODE_ENV === 'dev') {
        this.database.useEmulator(FIREBASE_CONSTANTS.EMULATOR.HOST, FIREBASE_CONSTANTS.EMULATOR.PORT);
        this.logger.log('Using Firebase emulator');
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

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  getFirestore(): admin.firestore.Firestore {
    return admin.firestore();
  }
}
