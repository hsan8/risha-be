# 🐦 Pigeon Management System

A complete CRUD (Create, Read, Update, Delete) application for managing pigeons built with NestJS backend and React frontend, using Firebase Realtime Database for data storage.

## 🚀 Features

### Backend (NestJS)

- ✅ Complete CRUD operations for pigeons
- ✅ Firebase Realtime Database integration
- ✅ RESTful API with Swagger documentation
- ✅ Input validation and error handling
- ✅ Repository pattern for data access
- ✅ Soft delete functionality
- ✅ Search functionality
- ✅ Ring number uniqueness validation
- ✅ Comprehensive logging
- ✅ TypeScript support

### Frontend (React)

- ✅ Modern, responsive UI design
- ✅ Real-time search functionality
- ✅ Form validation
- ✅ Modal forms for create/edit
- ✅ Card-based layout
- ✅ Health status indicators
- ✅ Loading states and error handling
- ✅ Mobile-responsive design

## 🏗️ Architecture

```
src/
├── pigeon/                    # Pigeon module
│   ├── controllers/          # HTTP controllers
│   ├── services/             # Business logic
│   ├── repositories/         # Data access layer
│   ├── entities/             # Data models
│   ├── dto/                  # Data transfer objects
│   ├── enums/                # Enumerations
│   ├── constants/            # Constants
│   └── pigeon.module.ts      # Module definition
├── core/                     # Core functionality
│   ├── services/             # Core services (Firebase)
│   └── modules/              # Core modules
└── frontend-example/         # React frontend demo
```

## 🛠️ Technology Stack

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: Firebase Realtime Database
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Logging**: Pino
- **Deployment**: Firebase Functions

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: CSS3 with modern design
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Realtime Database enabled
- Firebase Admin SDK credentials

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd risha-be
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Realtime Database
3. Set up Firebase Admin SDK:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download the JSON file

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Development environment
NODE_ENV=dev

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# For production, add Firebase Admin SDK credentials
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
```

### 5. Build and Run

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Firebase Functions deployment
npm run deploy
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/pigeons
```

### Endpoints

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/pigeons`                   | Create a new pigeon        |
| GET    | `/pigeons`                   | Get all pigeons            |
| GET    | `/pigeons/count`             | Get total count of pigeons |
| GET    | `/pigeons/search?q={query}`  | Search pigeons by query    |
| GET    | `/pigeons/ring/{ringNumber}` | Get pigeon by ring number  |
| GET    | `/pigeons/{id}`              | Get pigeon by ID           |
| PATCH  | `/pigeons/{id}`              | Update pigeon              |
| DELETE | `/pigeons/{id}`              | Soft delete pigeon         |

### Swagger Documentation

When running in development mode, access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

## 🎨 Frontend Demo

### Running the Frontend Demo

1. Navigate to the frontend example directory:

```bash
cd frontend-example
```

2. Open `index.html` in a web browser or serve it with a local server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8080
```

3. Open your browser and navigate to `http://localhost:8080`

### Frontend Features

- **Modern UI**: Clean, card-based design with smooth animations
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Real-time Search**: Instant search across all pigeon fields
- **Form Validation**: Client-side validation with helpful error messages
- **Health Status**: Color-coded health status indicators
- **Modal Forms**: Overlay forms for creating and editing pigeons

## 📊 Data Model

### Pigeon Entity

```typescript
{
  id: string;                    // Unique identifier
  name: string;                  // Pigeon name (required)
  breed?: string;                // Breed of the pigeon
  color?: string;                // Color of the pigeon
  age?: number;                  // Age in months
  weight?: number;               // Weight in grams
  gender?: string;               // Male/Female
  ringNumber?: string;           // Ring number (unique)
  owner?: string;                // Owner name
  healthStatus?: string;         // Health status
  isActive?: boolean;            // Active status (default: true)
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

## 🔧 Usage Examples

### Creating a Pigeon

```bash
curl -X POST http://localhost:3000/api/pigeons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Speedy",
    "breed": "Racing",
    "color": "Blue",
    "age": 24,
    "weight": 450,
    "gender": "Male",
    "ringNumber": "2023-123456",
    "owner": "John Doe",
    "healthStatus": "Healthy"
  }'
```

### Getting All Pigeons

```bash
curl http://localhost:3000/api/pigeons
```

### Searching Pigeons

```bash
curl "http://localhost:3000/api/pigeons/search?q=racing"
```

### Updating a Pigeon

```bash
curl -X PATCH http://localhost:3000/api/pigeons/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 460,
    "healthStatus": "Recovering"
  }'
```

### Deleting a Pigeon

```bash
curl -X DELETE http://localhost:3000/api/pigeons/{id}
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Test Structure

- **Unit Tests**: Test individual services and controllers
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test complete user workflows

## 🚀 Deployment

### Firebase Functions Deployment

```bash
# Build the project
npm run build

# Deploy to Firebase Functions
npm run deploy
```

### Environment Configuration

For production deployment, ensure the following environment variables are set:

```env
NODE_ENV=production
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_STORAGE_BUCKET=your-production-project-id.appspot.com
```

## 🔒 Security Features

- Input validation using class-validator
- SQL injection prevention through Firebase Admin SDK
- Rate limiting with NestJS Throttler
- CORS configuration
- Error handling without exposing sensitive information

## 📈 Performance Features

- Efficient Firebase Realtime Database queries
- Soft delete to maintain data integrity
- Optimized search functionality
- Responsive frontend with lazy loading
- Caching strategies for frequently accessed data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](http://localhost:3000/api-docs)
2. Review the [Firebase Console](https://console.firebase.google.com/) for database issues
3. Check the application logs for detailed error information
4. Create an issue in the repository

## 🎯 Roadmap

- [ ] Add authentication and authorization
- [ ] Implement real-time updates using Firebase listeners
- [ ] Add image upload for pigeon photos
- [ ] Create mobile app using React Native
- [ ] Add breeding and pedigree tracking
- [ ] Implement race result tracking
- [ ] Add analytics and reporting features
- [ ] Create admin dashboard
- [ ] Add multi-language support
- [ ] Implement backup and restore functionality

---

**Built with ❤️ using NestJS, React, and Firebase**
