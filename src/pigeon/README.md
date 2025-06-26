# Pigeon Management System

A comprehensive CRUD (Create, Read, Update, Delete) API for managing pigeons with parent relationships, status management, and automatic registration number generation using Firebase Realtime Database.

## 🚀 Features

- ✅ Complete CRUD operations for pigeons
- ✅ Parent-child relationships (father/mother)
- ✅ Status management (ALIVE, DEAD, SOLD)
- ✅ Automatic registration number generation (####-#-### pattern)
- ✅ Ring number and documentation number uniqueness validation
- ✅ Parent validation (gender and status checks)
- ✅ Status transition validation
- ✅ Search functionality across multiple fields
- ✅ Firebase Realtime Database integration
- ✅ Comprehensive validation and error handling
- ✅ Swagger API documentation

## 📊 Data Model

### Pigeon Entity

```typescript
{
  id: string;                    // Unique identifier
  name: string;                  // Pigeon name (required)
  gender: PigeonGender;          // MALE or FEMALE (required)
  status: PigeonStatus;          // ALIVE, DEAD, or SOLD (required)
  ownerId?: string;              // Owner ID (optional)
  documentationNo: string;       // Registration number (required)
  ringNo: string;                // Ring number (required)
  ringColor: string;             // Ring color (required)
  caseNumber?: string;           // Case number (optional)
  fatherName: string;            // Father name (required)
  father?: Pigeon;               // Father pigeon object (optional)
  motherName: string;            // Mother name (required)
  mother?: Pigeon;               // Mother pigeon object (optional)
  yearOfBirth: string;           // Year of birth (required)
  deadAt?: Date;                 // Date of death (optional)
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

### Enums

```typescript
enum PigeonGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum PigeonStatus {
  ALIVE = 'ALIVE',
  DEAD = 'DEAD',
  SOLD = 'SOLD',
}
```

## 🔧 Business Rules

### Registration Number Generation

- **Pattern**: `####-#-###` (e.g., 2025-A-123)
- **Format**: Year of birth - Letter - Sequence number
- **Auto-generation**: If not provided, automatically generated based on year
- **Uniqueness**: Must be unique across all pigeons

### Parent Relationships

- **Father**: Must be a male pigeon with ALIVE status
- **Mother**: Must be a female pigeon with ALIVE status
- **Manual entry**: If parent doesn't exist, user can type name manually
- **Validation**: System validates parent gender and status

### Status Management

- **ALIVE**: Default status for new pigeons
- **DEAD**: Requires `deadAt` date, cannot be changed back
- **SOLD**: Can only be applied to ALIVE pigeons, cannot revert to ALIVE
- **Transitions**: Validated to prevent invalid status changes

### Ring Number

- **Uniqueness**: Must be unique across all pigeons
- **Format**: Alphanumeric characters only

## 📚 API Endpoints

### Base URL

```
/api/pigeons
```

### Endpoints

| Method | Endpoint                                      | Description                        |
| ------ | --------------------------------------------- | ---------------------------------- |
| POST   | `/pigeons`                                    | Create a new pigeon                |
| GET    | `/pigeons`                                    | Get all pigeons                    |
| GET    | `/pigeons/alive`                              | Get all alive pigeons              |
| GET    | `/pigeons/parents`                            | Get all alive parent pigeons       |
| GET    | `/pigeons/count`                              | Get total count of pigeons         |
| GET    | `/pigeons/count/:status`                      | Get count by status                |
| GET    | `/pigeons/search?q={query}`                   | Search pigeons                     |
| GET    | `/pigeons/ring/:ringNo`                       | Get pigeon by ring number          |
| GET    | `/pigeons/documentation/:documentationNo`     | Get pigeon by documentation number |
| GET    | `/pigeons/generate-registration/:yearOfBirth` | Generate registration number       |
| GET    | `/pigeons/:id`                                | Get pigeon by ID                   |
| PATCH  | `/pigeons/:id`                                | Update pigeon                      |
| PATCH  | `/pigeons/:id/status`                         | Update pigeon status               |
| DELETE | `/pigeons/:id`                                | Delete pigeon                      |

## 🔧 Usage Examples

### Create a Pigeon

```bash
POST /api/pigeons
Content-Type: application/json

{
  "name": "Speedy",
  "gender": "MALE",
  "status": "ALIVE",
  "documentationNo": "2025-A-001",
  "ringNo": "123456",
  "ringColor": "Blue",
  "fatherName": "Father Pigeon",
  "motherName": "Mother Pigeon",
  "yearOfBirth": "2025",
  "ownerId": "owner123"
}
```

### Create Pigeon with Parent References

```bash
POST /api/pigeons
Content-Type: application/json

{
  "name": "Junior",
  "gender": "MALE",
  "status": "ALIVE",
  "ringNo": "789012",
  "ringColor": "Red",
  "fatherName": "Father Pigeon",
  "fatherId": "father-pigeon-id",
  "motherName": "Mother Pigeon",
  "motherId": "mother-pigeon-id",
  "yearOfBirth": "2025"
}
```

### Update Pigeon Status

```bash
PATCH /api/pigeons/{id}/status
Content-Type: application/json

{
  "status": "DEAD",
  "deadAt": "2025-01-15T10:30:00Z"
}
```

### Generate Registration Number

```bash
GET /api/pigeons/generate-registration/2025
```

Response:

```json
{
  "registrationNumber": "2025-A-001"
}
```

### Get Alive Parents

```bash
GET /api/pigeons/parents
```

Response:

```json
{
  "fathers": [
    {
      "id": "father1",
      "name": "Father Pigeon 1",
      "gender": "MALE",
      "status": "ALIVE"
    }
  ],
  "mothers": [
    {
      "id": "mother1",
      "name": "Mother Pigeon 1",
      "gender": "FEMALE",
      "status": "ALIVE"
    }
  ]
}
```

## 🔒 Validation Rules

### Required Fields

- **name**: String, max 100 characters
- **gender**: Must be MALE or FEMALE
- **status**: Must be ALIVE, DEAD, or SOLD
- **documentationNo**: Must follow ####-#-### pattern
- **ringNo**: String, max 20 characters, unique
- **ringColor**: String, max 30 characters
- **fatherName**: String, max 100 characters
- **motherName**: String, max 100 characters
- **yearOfBirth**: Must be 4-digit year

### Optional Fields

- **ownerId**: String, max 100 characters
- **caseNumber**: String, max 50 characters
- **fatherId**: Must reference existing male ALIVE pigeon
- **motherId**: Must reference existing female ALIVE pigeon
- **deadAt**: ISO date string (required when status is DEAD)

## ⚠️ Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `204` - No Content (for delete)
- `400` - Bad Request (validation error, invalid status transition)
- `404` - Not Found
- `409` - Conflict (duplicate ring number or documentation number)
- `500` - Internal Server Error

### Common Error Messages

- `Pigeon with ring number {ringNo} already exists`
- `Pigeon with documentation number {docNo} already exists`
- `Father pigeon with ID {id} not found`
- `Pigeon with ID {id} is not a male pigeon`
- `Father pigeon with ID {id} is not alive`
- `Cannot change status from DEAD to another status`
- `Cannot change status from SOLD to ALIVE`
- `Dead date is required when changing status to DEAD`

## 🔧 Services

### PigeonService

Main business logic service handling:

- CRUD operations
- Parent relationship validation
- Status transition validation
- Ring number and documentation number uniqueness

### RegistrationNumberService

Handles registration number generation:

- Automatic generation following ####-#-### pattern
- Validation of registration number format
- Parsing registration number components

### PigeonRepository

Data access layer for Firebase operations:

- CRUD operations
- Search functionality
- Parent queries
- Status-based queries

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📖 Swagger Documentation

When running in development mode, access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

## 🚀 Deployment

The module is ready for deployment with Firebase Functions:

```bash
# Build the project
npm run build

# Deploy to Firebase Functions
npm run deploy
```

## 🔄 Status Transitions

| Current Status | Allowed Transitions | Notes                                        |
| -------------- | ------------------- | -------------------------------------------- |
| ALIVE          | DEAD, SOLD          | Can change to DEAD (requires deadAt) or SOLD |
| DEAD           | None                | Cannot change from DEAD status               |
| SOLD           | None                | Cannot change from SOLD status               |

## 📈 Performance Features

- Efficient Firebase Realtime Database queries
- Optimized search functionality
- Parent relationship caching
- Registration number generation optimization
- Comprehensive error handling and logging

## 🔮 Future Enhancements

- [ ] Add breeding history tracking
- [ ] Implement pedigree visualization
- [ ] Add race result tracking
- [ ] Create offspring tracking
- [ ] Add image upload for pigeons
- [ ] Implement batch operations
- [ ] Add export functionality
- [ ] Create analytics dashboard
