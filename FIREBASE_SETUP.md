# Firebase Setup Guide

This guide will help you set up Firebase credentials for the Risha Backend application.

## Prerequisites

1. A Firebase project with Realtime Database enabled
2. Firebase Admin SDK service account key

## Step 1: Get Firebase Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`risha-ef11e`)
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file

## Step 2: Configure Service Account

1. Copy the downloaded JSON file to `src/config/firebase-service-account.json`
2. Make sure the file is not committed to git (it's already in `.gitignore`)

## Step 3: Verify Environment Configuration

Ensure your `src/config/dev.env` file contains:

```env
NODE_ENV=dev
FIREBASE_PROJECT_ID=risha-ef11e
FIREBASE_STORAGE_BUCKET=risha-ef11e.appspot.com
FIREBASE_SERVICE_ACCOUNT_PATH=src/config/firebase-service-account.json
```

## Step 4: Test the Setup

Run the application:

```bash
npm run start:dev
```

You should see: `Firebase Admin SDK initialized successfully`

## Alternative: Using Firebase Emulator (Development Only)

If you want to use Firebase emulator for local development:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Start the emulator: `firebase emulators:start`
3. The application will automatically connect to the emulator

## Troubleshooting

### Error: "FIREBASE_PROJECT_ID is required"

- Check that `FIREBASE_PROJECT_ID` is set in your environment file
- Verify the project ID matches your Firebase project

### Error: "Could not load service account from path"

- Ensure the service account JSON file exists at the specified path
- Check that the JSON file is valid and contains all required fields

### Error: "No Firebase credentials found"

- This is a warning, not an error
- The application will try to use default credentials or work with emulator
- For production, always provide a service account key

## Security Notes

- Never commit the service account JSON file to version control
- The file is already added to `.gitignore`
- Use different service accounts for different environments (dev, staging, prod)
- Regularly rotate your service account keys

## Production Deployment

For production deployment on Firebase Functions:

1. The service account is automatically available in the Firebase Functions environment
2. No additional configuration is needed
3. The application will use default credentials automatically
