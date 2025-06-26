# Index Files Rules

## General Index Guidelines

### 1. Always Use Barrel Exports

- **ALWAYS** create index files for directories with multiple exports
- Use barrel exports to provide clean, organized import paths
- Maintain consistent export patterns across the codebase

### 2. Index File Structure

#### Basic Index Pattern

```typescript
// ✅ Correct - Simple barrel export
export * from './user.service';
export * from './paci.service';
export * from './paci-limiter.service';
```

#### Organized Index Pattern

```typescript
// ✅ Correct - Organized with comments
// Services
export * from './user.service';
export * from './paci.service';
export * from './paci-limiter.service';

// Types
export * from './types';

// Utilities
export * from './utils';
```

### 3. Directory Structure Patterns

#### Module Structure

```
src/users/
├── constants/
│   ├── index.ts
│   └── paci.constant.ts
├── dtos/
│   ├── index.ts
│   ├── requests/
│   │   ├── index.ts
│   │   └── create-user.request.dto.ts
│   └── responses/
│       ├── index.ts
│       └── user.response.dto.ts
├── entities/
│   ├── index.ts
│   └── user.entity.ts
├── enums/
│   ├── index.ts
│   └── user-status.enum.ts
├── interfaces/
│   ├── index.ts
│   └── paci-callback.interface.ts
├── services/
│   ├── index.ts
│   ├── user.service.ts
│   └── paci.service.ts
└── index.ts
```

#### Core Module Structure

```
src/core/
├── constants/
│   ├── index.ts
│   └── numbers.constant.ts
├── decorators/
│   ├── index.ts
│   └── api-response.decorator.ts
├── dtos/
│   ├── index.ts
│   ├── requests/
│   │   ├── index.ts
│   │   └── page-options.request.dto.ts
│   └── responses/
│       ├── index.ts
│       ├── data.response.dto.ts
│       └── data-array.response.dto.ts
├── enums/
│   ├── index.ts
│   └── user-locale.enum.ts
├── guards/
│   ├── index.ts
│   └── throttler-behind-proxy.guard.ts
├── interfaces/
│   ├── index.ts
│   └── authenticated-user.interface.ts
├── utils/
│   ├── index.ts
│   ├── response-factory.util.ts
│   └── i18n-context-wrapper.util.ts
└── index.ts
```

### 4. Export Patterns by Type

#### Constants

```typescript
// constants/index.ts
export * from './paci.constant';
export * from './auth-regex-validation-rules.constant';
export * from './rmq-patterns.constant';
```

#### DTOs

```typescript
// dtos/index.ts
export * from './requests';
export * from './responses';

// dtos/requests/index.ts
export * from './create-user.request.dto';
export * from './update-user.request.dto';
export * from './page-options.request.dto';

// dtos/responses/index.ts
export * from './user.response.dto';
export * from './user-details.response.dto';
export * from './data.response.dto';
export * from './data-array.response.dto';
export * from './data-page.response.dto';
```

#### Services

```typescript
// services/index.ts
export * from './user.service';
export * from './paci.service';
export * from './paci-limiter.service';
```

#### Entities

```typescript
// entities/index.ts
export * from './user.entity';
export * from './beneficiary.entity';
export * from './transfer.entity';
```

#### Enums

```typescript
// enums/index.ts
export * from './user-status.enum';
export * from './user-locale.enum';
export * from './auth-role.enum';
```

#### Interfaces

```typescript
// interfaces/index.ts
export * from './paci-callback.interface';
export * from './authenticated-user.interface';
export * from './user-profile.interface';
```

### 5. Import Patterns

#### From Index Files

```typescript
// ✅ Correct - Import from index files
import { UserService, PaciService } from '~/users/services';
import { CreateUserRequestDto, UserResponseDto } from '~/users/dtos';
import { UserLocale, AuthRole } from '~/core/enums';
import { IAuthenticatedUser } from '~/common/interfaces';

// ❌ Incorrect - Direct file imports
import { UserService } from '~/users/services/user.service';
import { CreateUserRequestDto } from '~/users/dtos/requests/create-user.request.dto';
import { UserLocale } from '~/core/enums/user-locale.enum';
```

#### Relative Imports

```typescript
// ✅ Correct - Relative imports for same module
import { PACI_CALLBACK_PATTERN } from '../constants';
import { CreateUserRequestDto } from '../dtos/requests';
import { UserService } from '../services';

// ✅ Correct - Relative imports for parent modules
import { IAuthenticatedUser } from '../../common/interfaces';
import { UserLocale } from '../../core/enums';
```

### 6. Module-Level Index Files

#### Feature Module Index

```typescript
// src/users/index.ts
export * from './constants';
export * from './dtos';
export * from './entities';
export * from './enums';
export * from './interfaces';
export * from './services';
```

#### Core Module Index

```typescript
// src/core/index.ts
export * from './constants';
export * from './decorators';
export * from './dtos';
export * from './enums';
export * from './guards';
export * from './interfaces';
export * from './utils';
```

### 7. Common Module Index

#### Common Dependencies

```typescript
// src/common/index.ts
export * from './dependencies';
export * from './enums';
export * from './interfaces';
```

#### Common Dependencies Index

```typescript
// src/common/dependencies/index.ts
export * from './eg-bank-http';
export * from './profile-ms';
export * from './rabbitmq-internal-module';
```

### 8. Lookups Module Index

#### Lookups Structure

```typescript
// src/lookups/index.ts
export * from './constants';
export * from './entities';
export * from './services';
```

#### Country-Specific Lookups

```typescript
// src/lookups/constants/country-trans/egy-banks/index.ts
import EgyBanksAR from './egy-banks-ar.json';
import EgyBanksEN from './egy-banks-en.json';

export { EgyBanksAR, EgyBanksEN };
```

### 9. Transfer Methods Module Index

#### Transfer Methods Structure

```typescript
// src/transfer-methods/index.ts
export * from './common';
export * from './bank-transfer-method';
export * from './cash-pickup-transfer-method';
export * from './wallet-transfer-method';
```

#### Common Transfer Methods

```typescript
// src/transfer-methods/common/index.ts
export * from './constants';
export * from './enums';
export * from './interfaces';
export * from './services';
```

### 10. Transfers Module Index

#### Transfers Structure

```typescript
// src/transfers/index.ts
export * from './country-trans-transfers';
export * from './entities';
export * from './services';
```

#### Country-Specific Transfers

```typescript
// src/transfers/country-trans-transfers/index.ts
export * from './common';
export * from './egbank';
```

### 11. Testing Index Files

#### Test Mocks Index

```typescript
// src/users/__testing__/index.ts
export * from './mocks';
export * from './mocks/user.entity.mock';
export * from './mocks/create-user-request.dto.mock';
```

#### Test Utilities Index

```typescript
// src/core/__testing__/index.ts
export * from './test-utils';
export * from './mock-factories';
```

### 12. Configuration Index Files

#### Module Options Index

```typescript
// src/core/module-options/index.ts
export * from './i18n.options';
export * from './logger.options';
export * from './database.options';
```

### 13. Best Practices

#### Avoid Circular Dependencies

```typescript
// ❌ Incorrect - Circular dependency
// module-a/index.ts
export * from './service-a';
export * from './service-b';

// module-b/index.ts
export * from '../module-a'; // This creates a circular dependency
export * from './service-c';
```

#### Use Specific Exports

```typescript
// ✅ Correct - Export specific items
export { UserService } from './user.service';
export { PaciService } from './paci.service';

// ✅ Correct - Export all
export * from './user.service';
export * from './paci.service';
```

#### Maintain Export Order

```typescript
// ✅ Correct - Logical order
// Constants first
export * from './constants';

// Types and interfaces
export * from './enums';
export * from './interfaces';

// DTOs
export * from './dtos';

// Entities
export * from './entities';

// Services last
export * from './services';
```

### 14. TypeScript Configuration

#### Path Mapping

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "~/*": ["src/*"],
      "@/*": ["src/*"]
    }
  }
}
```

#### Module Resolution

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### 15. Maintenance Guidelines

#### Keep Index Files Updated

- Always update index files when adding new files
- Remove exports when files are deleted
- Maintain consistent export patterns

#### Review Import Paths

- Regularly review import statements
- Ensure all imports use index files
- Update any direct file imports to use barrel exports

#### Documentation

- Add comments to complex index files
- Document any special export patterns
- Keep index files organized and readable
