# Risha Backend API - Postman Collection

This directory contains Postman collections, environments, and test suites for the Risha Backend API with JWT authentication.

## Files Overview

### 1. Collections

- **`Risha-BE-Updated.postman_collection.json`** - Main API collection with JWT authentication
- **`Risha-BE-Tests.postman_collection.json`** - Comprehensive test suite
- **`Risha-BE.postman_collection.json`** - Original collection (legacy, no auth)

### 2. Environment

- **`Risha-BE-Environment.postman_environment.json`** - Environment variables for API testing

## Setup Instructions

### 1. Import Collections and Environment

1. Open Postman
2. Click "Import" button
3. Import all JSON files from this directory:
   - `Risha-BE-Updated.postman_collection.json`
   - `Risha-BE-Tests.postman_collection.json`
   - `Risha-BE-Environment.postman_environment.json`

### 2. Set Environment

1. In Postman, click on the environment dropdown (top-right)
2. Select "Risha-BE-Environment"
3. Verify the `baseUrl` is set to your API URL (default: `http://localhost:3000`)

### 3. Start Your API Server

Make sure your Risha Backend API is running:

```bash
npm run start:dev
# or
npm start
```

## Authentication Flow

The API uses JWT Bearer token authentication. Follow these steps:

### 1. Register a New User (First Time)

Use the "Register User" request in the Authentication folder:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "testPassword123",
  "phone": "+1234567890"
}
```

### 2. Login to Get JWT Token

Use the "Login User" request:

```json
{
  "email": "test@example.com",
  "password": "testPassword123"
}
```

The login response will automatically:

- Store the `accessToken` in environment variables
- Set the token expiry time
- Store user information (ID, email, role)

### 3. Use Protected Endpoints

All pigeon and formula endpoints require authentication. The token is automatically included in requests using the `{{accessToken}}` variable.

## Environment Variables

The environment includes these pre-configured variables:

| Variable       | Description                   | Example                   |
| -------------- | ----------------------------- | ------------------------- |
| `baseUrl`      | API base URL                  | `http://localhost:3000`   |
| `accessToken`  | JWT access token (auto-set)   | `eyJhbGciOiJIUzI1NiIs...` |
| `refreshToken` | JWT refresh token (auto-set)  | `eyJhbGciOiJIUzI1NiIs...` |
| `userId`       | Current user ID (auto-set)    | `user-uuid-here`          |
| `userEmail`    | Current user email (auto-set) | `test@example.com`        |
| `testEmail`    | Test user email               | `test@example.com`        |
| `testPassword` | Test user password            | `testPassword123`         |
| `pigeonId`     | Test pigeon ID (auto-set)     | `pigeon-uuid-here`        |
| `formulaId`    | Test formula ID (auto-set)    | `formula-uuid-here`       |

## API Endpoints

### Authentication Endpoints (No Auth Required)

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/google` - Google OAuth
- `POST /auth/apple` - Apple OAuth
- `POST /auth/forgot-password` - Send password reset OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Reset password

### Pigeon Endpoints (JWT Required)

- `POST /pigeons` - Create pigeon
- `GET /pigeons` - Get all user's pigeons (paginated)
- `GET /pigeons/:id` - Get pigeon by ID
- `PATCH /pigeons/:id` - Update pigeon
- `DELETE /pigeons/:id` - Delete pigeon
- `GET /pigeons/search` - Search pigeons
- `GET /pigeons/ring/:ringNo` - Find by ring number
- `GET /pigeons/documentation/:docNo` - Find by documentation number
- `GET /pigeons/alive` - Get alive pigeons
- `GET /pigeons/parents` - Get parent pigeons
- `GET /pigeons/count` - Get pigeon count
- `GET /pigeons/count/:status` - Get count by status

### Formula Endpoints (JWT Required)

- `POST /formulas` - Create formula
- `GET /formulas` - Get all user's formulas (paginated)
- `GET /formulas/:id` - Get formula by ID
- `PUT /formulas/:id/egg` - Add egg to formula
- `PUT /formulas/:id/egg/:eggId/transform` - Transform egg to pigeon
- `PUT /formulas/:id/terminate` - Terminate formula
- `GET /formulas/search` - Search formulas
- `GET /formulas/count` - Get formula count
- `GET /formulas/count/:status` - Get count by status

### Health Check (No Auth Required)

- `GET /health` - Health check

## Running Tests

### Using Test Collection

1. Select the "Risha-BE-Tests" collection
2. Click "Run" button
3. Configure test run settings:
   - Environment: "Risha-BE-Environment"
   - Iterations: 1
   - Delay: 0ms
4. Click "Run Risha-BE-Tests"

The test suite will:

1. Register a test user
2. Login and get JWT token
3. Create, read, update, and delete pigeons
4. Create and manage formulas
5. Test authentication security
6. Clean up test data

### Manual Testing

1. Start with Authentication requests to get a token
2. Use the token for all protected endpoints
3. Environment variables are automatically managed

## Pre-request Scripts

The collection includes pre-request scripts that:

- Check token expiry
- Skip authentication for auth endpoints
- Provide warnings for missing tokens

## Post-response Scripts

Login and registration requests automatically:

- Extract and store JWT tokens
- Calculate token expiry times
- Store user information
- Set test variables (pigeon ID, formula ID, etc.)

## Troubleshooting

### Common Issues

1. **401 Unauthorized Error**

   - Solution: Make sure you're logged in and have a valid token
   - Check if the token has expired (15 minutes default)

2. **Token Expired**

   - Solution: Run the "Login User" request again to get a new token

3. **404 Not Found**

   - Solution: Check if the `baseUrl` environment variable is correct
   - Ensure the API server is running

4. **Environment Variables Not Set**
   - Solution: Make sure you've selected the "Risha-BE-Environment"
   - Check that login was successful and tokens were stored

### Debug Steps

1. Check the Postman Console for logs
2. Verify environment variables are set correctly
3. Test the health check endpoint first
4. Ensure proper request headers are included

## Security Notes

- JWT tokens expire after 15 minutes
- All user data is isolated per user (user-scoped)
- Tokens are stored as secret environment variables
- Test data is automatically cleaned up after tests

## Development Workflow

1. **First Time Setup**

   - Import collections and environment
   - Register a test user
   - Run the test collection to verify everything works

2. **Daily Development**

   - Login to get a fresh token
   - Use the main collection for manual testing
   - Run specific test folders for regression testing

3. **Continuous Testing**
   - Run the full test suite before commits
   - Use the test collection in CI/CD pipelines
   - Monitor test results for API changes

## API Documentation

For detailed API documentation, visit the Swagger UI when the server is running:

- Local: `http://localhost:3000/api/docs`
- The API documentation includes all endpoints with JWT authentication requirements

## Support

If you encounter issues:

1. Check the API server logs
2. Verify your environment variables
3. Test individual requests before running the full suite
4. Check the Postman Console for detailed error messages
