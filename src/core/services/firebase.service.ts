import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { Database } from 'firebase-admin/database';
import { FIREBASE_CONSTANTS } from '../constants/firebase.constant';

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
      const serviceAccount = this.configService.get('FIREBASE_SERVICE_ACCOUNT');
      const databaseURL = this.configService.get('FIREBASE_DATABASE_URL');

      if (!serviceAccount || !databaseURL) {
        throw new Error('Firebase configuration is missing');
      }

      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL,
      });

      this.logger.log('Firebase app initialized successfully');

      this.database = admin.database(this.app);
      this.database.useEmulator(FIREBASE_CONSTANTS.EMULATOR.HOST, FIREBASE_CONSTANTS.EMULATOR.PORT);

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
