# Import Rules

## General Import Guidelines

### 1. Always Import from Index Files

- **ALWAYS** import from index files when available
- Use barrel exports for cleaner imports
- Example: `import { UserService } from '~/users/services';` instead of `import { UserService } from '~/users/services/user.service';`

### 2. Import Order

1. External libraries (NestJS, third-party)
2. Internal modules (using `~` alias)
3. Relative imports (for same module)

### 3. Import Patterns by Type

#### Constants

```typescript
// ✅ Correct
import { PACI_CALLBACK_PATTERN } from '../constants';

// ❌ Incorrect
import { PACI_CALLBACK_PATTERN } from '../constants/paci.constant';
```

#### Services

```typescript
// ✅ Correct
import { UserService, PaciService } from '../services';

// ❌ Incorrect
import { UserService } from '../services/user.service';
import { PaciService } from '../services/paci.service';
```

#### DTOs

```typescript
// ✅ Correct
import { CreateUserProfileRequestDto } from '../dtos/requests';
import { UserDetailsResponseDto } from '../dtos/responses';

// ❌ Incorrect
import { CreateUserProfileRequestDto } from '../dtos/requests/create-user-profile.request.dto';
```

#### Enums

```typescript
// ✅ Correct
import { UserLocale, AuthRole } from '~/core/enums';

// ❌ Incorrect
import { UserLocale } from '~/core/enums/user-locale.enum';
```

#### Interfaces

```typescript
// ✅ Correct
import { IAuthenticatedUser } from '~/common/interfaces';

// ❌ Incorrect
import { IAuthenticatedUser } from '~/common/interfaces/authenticated-user.interface';
```

### 4. Path Aliases

- Use `~` alias for src directory: `~/core/enums`
- Use relative paths for same module: `../constants`
- Use relative paths for parent modules: `../../common/interfaces`

### 5. Import Grouping

```typescript
// External libraries
import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { I18nLang } from 'nestjs-i18n';

// Internal modules (using ~ alias)
import { IAuthenticatedUser } from '~/common/interfaces';
import {
  ApiDataResponse,
  ApiForbiddenResponseBody,
  ApiLangRequestHeader,
  ApiUnauthorizedResponseBody,
} from '~/core/decorators';
import { UserLocale } from '~/core/enums';
import { ThrottlerBehindProxyGuard } from '~/core/guards';
import { ResponseFactory } from '~/core/utils';

// Same module imports (relative paths)
import { PACI_CALLBACK_PATTERN } from '../constants';
import { CreateUserProfileRequestDto } from '../dtos/requests';
import { UserDetailsResponseDto } from '../dtos/responses';
import { UserService } from '../services';
```

### 6. Destructuring Imports

- Use destructuring for multiple imports from same module
- Group related imports together

```typescript
// ✅ Correct
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// ❌ Incorrect
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
```

### 7. Type Imports

- Use type imports for TypeScript types when not needed at runtime
- Use regular imports for classes, functions, and values

```typescript
// ✅ Correct
import type { Config } from 'jest';
import { buildJestConfig } from './jest.base.config';

// ✅ Correct
import { DeepMocked, createMock } from '@golevelup/ts-jest';
```

### 8. Default vs Named Exports

- Prefer named exports over default exports
- Use consistent export patterns across modules

```typescript
// ✅ Correct - Named exports
export * from './data.response.dto';
export * from './data-array.response.dto';

// ❌ Avoid - Default exports
export default class DataResponseDto {}
```
