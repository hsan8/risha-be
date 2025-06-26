# Formula Management System

A comprehensive API for managing pigeon formulas (breeding pairs) with parent relationships, egg tracking, and status management using Firebase Realtime Database.

## 🚀 Features

- ✅ Complete CRUD operations for formulas
- ✅ Parent-child relationships (father/mother)
- ✅ Status management (INITIATED, TERMINATED, HAS_ONE_EGG, HAS_TWO_EGG, HAS_ONE_PIGEON, HAS_TWO_PIGEON)
- ✅ Egg tracking and transformation to pigeons
- ✅ History tracking for all actions
- ✅ Parent validation (existing or new)
- ✅ Status transition validation
- ✅ Search functionality across multiple fields
- ✅ Firebase Realtime Database integration
- ✅ Comprehensive validation and error handling
- ✅ Swagger API documentation

## 📊 Data Model

### Formula Entity

```typescript
{
  id: string;                    // Unique identifier
  father: {                      // Father information
    id?: string;                 // Father ID (optional)
    name: string;                // Father name (required)
  };
  mother: {                      // Mother information
    id?: string;                 // Mother ID (optional)
    name: string;                // Mother name (required)
  };
  caseNumber?: string;           // Case number (optional)
  eggs: {                        // Array of eggs
    id: string;                  // Egg ID
    deliveredAt: Date;           // Delivery date
    transformedToPigeonAt?: Date;// Transformation date (optional)
    pigeonId?: string;          // Transformed pigeon ID (optional)
  }[];
  children: string[];            // Array of pigeon IDs
  status: FormulaStatus;         // Current status
  history: {                     // Action history
    action: FormulaActions;      // Action type
    description: string;         // Action description
    date: Date;                  // Action date
  }[];
  yearOfFormula: string;         // Formula year
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

### Enums

```typescript
enum FormulaStatus {
  INITIATED = 'INITIATED',
  TERMINATED = 'TERMINATED',
  HAS_ONE_EGG = 'HASONEEGG',
  HAS_TWO_EGG = 'HASTWOEGG',
  HAS_ONE_PIGEON = 'HASONEPIGEON',
  HAS_TWO_PIGEON = 'HASTWOPIGEON',
}

enum FormulaActions {
  FORMULA_INITIATED = 'FORMULA_INITIATED',
  FIRST_EGG_DELIVERED = 'FIRST_EGG_DELIVERED',
  SECOND_EGG_DELIVERED = 'SECOND_EGG_DELIVERED',
  FIRST_EGG_TRANSFORMED_TO_FRESH_PIGEON = 'FIRST_EGG_TRANSFORMED_TO_FRESH_PIGEON',
  SECOND_EGG_TRANSFORMED_TO_FRESH_PIGEON = 'SECOND_EGG_TRANSFORMED_TO_FRESH_PIGEON',
  FORMULA_GOT_TERMINATED = 'FORMULA_GOT_TERMINATED',
}
```

## 🔧 Business Rules

### Parent Management

- **Parents**: Can be existing pigeons (with ID) or new names
- **Validation**: If ID provided, must be valid pigeon ID
- **History**: Parent changes are tracked in history

### Egg Management

- **Maximum**: Two eggs per formula
- **Status**: Updates automatically based on egg count
- **Transformation**: Eggs can be transformed to pigeons
- **History**: All egg events are tracked

### Status Management

- **INITIATED**: Initial status when formula is created
- **HAS_ONE_EGG**: When first egg is delivered
- **HAS_TWO_EGG**: When second egg is delivered
- **HAS_ONE_PIGEON**: When first egg transforms to pigeon
- **HAS_TWO_PIGEON**: When second egg transforms to pigeon
- **TERMINATED**: When formula is terminated
- **Transitions**: Validated to prevent invalid status changes

## 📚 API Endpoints

### Base URL

```
/api/formulas
```

### Registration Endpoints

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/`              | Create a new formula        |
| GET    | `/`              | Get all formulas            |
| GET    | `/:id`           | Get formula by ID           |
| GET    | `/count`         | Get total count of formulas |
| GET    | `/count/:status` | Get count by status         |

### Status Endpoints

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| PUT    | `/:id/egg`                  | Add an egg to formula   |
| PUT    | `/:id/egg/:eggId/transform` | Transform egg to pigeon |
| PUT    | `/:id/terminate`            | Terminate formula       |

### Search Endpoints

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| GET    | `/search?q={query}`    | Search formulas            |
| GET    | `/case/:caseNumber`    | Get formula by case number |
| GET    | `/year/:yearOfFormula` | Get formulas by year       |

### Parent Endpoints

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/parent/:parentId`        | Get formulas by parent ID   |
| GET    | `/parent/name/:parentName` | Get formulas by parent name |

## 🔧 Usage Examples

### Create a Formula

```bash
POST /api/formulas
Content-Type: application/json

{
  "father": {
    "name": "Thunder Sr."
  },
  "mother": {
    "id": "existing-pigeon-id",
    "name": "Storm"
  },
  "caseNumber": "CASE123",
  "yearOfFormula": "2024"
}
```

### Add an Egg

```bash
PUT /api/formulas/{id}/egg
```

### Transform Egg to Pigeon

```bash
PUT /api/formulas/{id}/egg/{eggId}/transform
Content-Type: application/json

{
  "pigeonId": "new-pigeon-id"
}
```

### Terminate Formula

```bash
PUT /api/formulas/{id}/terminate
Content-Type: application/json

{
  "reason": "Breeding pair incompatible"
}
```
