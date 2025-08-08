# Quick Setup Guide for Risha API Testing

## Prerequisites

1. **Install Newman** (Postman CLI):

   ```bash
   npm install -g newman
   ```

2. **Start the API Server**:
   ```bash
   npm run start:dev
   ```

## Quick Start (5 minutes)

### 1. Import to Postman (GUI Method)

1. Open Postman
2. Click "Import" → "Upload Files"
3. Select these files:
   - `Risha-BE-Updated.postman_collection.json`
   - `Risha-BE-Environment.postman_environment.json`
4. Select "Risha-BE-Environment" from the environment dropdown
5. Go to "Authentication" folder → "Login User" → Click "Send"
6. Now you can use any protected endpoint!

### 2. Command Line Testing

```bash
# Run all tests
npm run test:postman

# Run main collection
npm run test:postman:main

# Run with Newman directly
npm run test:api
```

## Test Flow

The automated test suite will:

1. **Register** a test user
2. **Login** and get JWT token
3. **Create** a test pigeon
4. **Create** a test formula
5. **Test** all CRUD operations
6. **Test** authentication security
7. **Clean up** test data

## Environment Variables

After login, these are automatically set:

- `accessToken` - JWT token for authentication
- `userId` - Your user ID
- `pigeonId` - Test pigeon ID
- `formulaId` - Test formula ID

## Manual Testing Steps

1. **Register/Login** (Authentication folder)
2. **Create Data** (Pigeons/Formulas folders)
3. **Test Operations** (GET, UPDATE, DELETE)

## Troubleshooting

- **401 Unauthorized**: Run login request first
- **404 Not Found**: Check if server is running on port 3000
- **Connection Error**: Verify `baseUrl` in environment

## API Endpoints Summary

### 🔐 Authentication (No token required)

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

### 🐦 Pigeons (JWT required)

- `POST /pigeons` - Create pigeon
- `GET /pigeons` - List pigeons
- `GET /pigeons/:id` - Get pigeon
- `PATCH /pigeons/:id` - Update pigeon
- `DELETE /pigeons/:id` - Delete pigeon

### 🥚 Formulas (JWT required)

- `POST /formulas` - Create formula
- `GET /formulas` - List formulas
- `GET /formulas/:id` - Get formula
- `PUT /formulas/:id/egg` - Add egg

### 🏥 Health Check (No token required)

- `GET /health` - Check API status

## Success Indicators

✅ **Login successful** → `accessToken` appears in environment
✅ **Create pigeon** → Returns pigeon with ID
✅ **List pigeons** → Returns array with your pigeon
✅ **Authentication test** → 401 error without token

That's it! You're ready to test the API. 🚀
