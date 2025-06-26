# Style Rules

## General Style Guidelines

### 1. Code Formatting

#### Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 120
}
```

#### ESLint Rules

```javascript
module.exports = {
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-inferrable-types': 'off',
    'func-names': ['error', 'as-needed'],
    'no-underscore-dangle': ['error'],
    'require-await': ['error'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-multi-assign': ['error'],
    'no-magic-numbers': [
      'error',
      {
        ignoreArrayIndexes: true,
        ignore: [0, 1, -1],
        enforceConst: true,
        detectObjects: false,
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
    'max-len': [
      'error',
      { code: 120, tabWidth: 2, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true },
    ],
  },
};
```

### 2. Naming Conventions

#### Files and Directories

- Use kebab-case for file and directory names
- Include type suffix for DTOs: `.request.dto.ts`, `.response.dto.ts`
- Include type suffix for entities: `.entity.ts`
- Include type suffix for services: `.service.ts`
- Include type suffix for controllers: `.controller.ts`

#### Classes and Interfaces

- Use PascalCase for class and interface names
- Prefix interfaces with `I`: `IUser`, `IAuthenticatedUser`
- Use descriptive names that indicate purpose

#### Variables and Functions

- Use camelCase for variables and functions
- Use descriptive names that indicate purpose
- Use verb-noun pattern for functions: `getUser`, `createUser`, `updateUser`

#### Constants

- Use UPPER_SNAKE_CASE for constants
- Group related constants in objects
- Use `as const` for type safety

```typescript
// ✅ Correct
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

// ❌ Incorrect
export const userStatus = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
};
```

### 3. Code Organization

#### Import Order

1. External libraries (NestJS, third-party)
2. Internal modules (using `~` alias)
3. Relative imports (for same module)

#### Class Structure

```typescript
export class UserService {
  // 1. Constructor
  constructor(private readonly userRepository: Repository<User>, private readonly configService: ConfigService) {}

  // 2. Public methods
  async createUser(userData: CreateUserRequestDto): Promise<User> {
    // Implementation
  }

  async getUserById(id: string): Promise<User> {
    // Implementation
  }

  // 3. Private methods
  private validateUserData(userData: CreateUserRequestDto): void {
    // Implementation
  }
}
```

#### Method Order

1. Constructor
2. Public methods
3. Private methods
4. Getters/setters

### 4. TypeScript Best Practices

#### Type Annotations

```typescript
// ✅ Correct - Explicit types for public APIs
export class UserService {
  async createUser(userData: CreateUserRequestDto): Promise<User> {
    // Implementation
  }
}

// ✅ Correct - Type inference for internal variables
const users = await this.userRepository.find();
const userCount = users.length;

// ❌ Incorrect - Unnecessary type annotations
const users: User[] = await this.userRepository.find();
const userCount: number = users.length;
```

#### Interface Definitions

```typescript
// ✅ Correct
export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Correct - Extending interfaces
export interface IAuthenticatedUser extends IUser {
  roles: string[];
  permissions: string[];
}
```

#### Type Guards

```typescript
// ✅ Correct
export function isUser(obj: any): obj is IUser {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

// Usage
if (isUser(data)) {
  // TypeScript knows data is IUser here
  console.log(data.name);
}
```

### 5. NestJS Patterns

#### Controller Structure

```typescript
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, ThrottlerBehindProxyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiDataResponse(UserResponseDto)
  @ApiUnauthorizedResponseBody()
  @ApiForbiddenResponseBody()
  async createUser(
    @Body() createUserDto: CreateUserRequestDto,
    @I18nLang() lang: string,
  ): Promise<DataResponseDto<UserResponseDto>> {
    const user = await this.userService.createUser(createUserDto);
    return ResponseFactory.data(new UserResponseDto(user, lang));
  }
}
```

#### Service Structure

```typescript
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(userData: CreateUserRequestDto): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
```

### 6. Error Handling

#### Exception Patterns

```typescript
// ✅ Correct - Use specific exceptions
if (!user) {
  throw new NotFoundException('User not found');
}

if (!user.isActive) {
  throw new BadRequestException('User is not active');
}

// ✅ Correct - Use i18n for error messages
throw new BadRequestException(this.i18n.t('AUTH.USER_ALREADY_EXISTS'));

// ❌ Incorrect - Generic exceptions
throw new Error('Something went wrong');
```

#### Try-Catch Patterns

```typescript
// ✅ Correct
async createUser(userData: CreateUserRequestDto): Promise<User> {
  try {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  } catch (error) {
    this.logger.error('Failed to create user', error);

    if (error.code === '23505') { // PostgreSQL unique constraint
      throw new ConflictException('User already exists');
    }

    throw new InternalServerErrorException('Failed to create user');
  }
}
```

### 7. Database Patterns

#### Entity Structure

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
```

#### Repository Pattern

```typescript
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }
}
```

### 8. Testing Patterns

#### Unit Test Structure

```typescript
describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    mockRepository = createMock<Repository<User>>();

    const module = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(User), useValue: mockRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const expectedUser = { id: 'uuid', ...userData } as User;

      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      // Act
      const result = await service.createUser(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedUser);
    });
  });
});
```

### 9. Documentation

#### JSDoc Comments

```typescript
/**
 * Creates a new user in the system
 * @param userData - The user data to create
 * @returns Promise<User> - The created user
 * @throws {BadRequestException} When user data is invalid
 * @throws {ConflictException} When user already exists
 */
async createUser(userData: CreateUserRequestDto): Promise<User> {
  // Implementation
}
```

#### Swagger Documentation

```typescript
@ApiOperation({
  summary: 'Create a new user',
  description: 'Creates a new user account with the provided information'
})
@ApiDataResponse(UserResponseDto)
@ApiUnauthorizedResponseBody()
@ApiForbiddenResponseBody()
async createUser(@Body() createUserDto: CreateUserRequestDto): Promise<DataResponseDto<UserResponseDto>> {
  // Implementation
}
```

### 10. Performance Considerations

#### Lazy Loading

```typescript
// ✅ Correct - Lazy load relationships
const users = await this.userRepository.find({
  relations: ['profile', 'settings'],
});

// ❌ Incorrect - Eager loading everything
const users = await this.userRepository.find();
```

#### Pagination

```typescript
// ✅ Correct - Use pagination for large datasets
async getUsers(page: number = 1, limit: number = 10): Promise<DataPageResponseDto<UserResponseDto>> {
  const [users, total] = await this.userRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });

  return ResponseFactory.dataPage(
    users.map(user => new UserResponseDto(user)),
    { page, limit, total }
  );
}
```

### 11. Security Patterns

#### Input Validation

```typescript
// ✅ Correct - Validate all inputs
@IsString()
@IsNotEmpty()
@Length(2, 100)
@Matches(/^[a-zA-Z\s]+$/, { message: 'Name must contain only letters and spaces' })
name!: string;

// ✅ Correct - Sanitize inputs
@Transform(({ value }) => value?.trim?.() ?? value)
@Transform(({ value }) => value?.toLowerCase?.() ?? value)
email!: string;
```

#### Authentication/Authorization

```typescript
// ✅ Correct - Use guards for protection
@UseGuards(AuthGuard, RoleGuard)
@Roles(AuthRole.ADMIN)
async deleteUser(@Param('id') id: string): Promise<void> {
  // Implementation
}
```

### 6. Logging Guidelines

#### Using the Logger

- Always use the NestJS Logger service instead of console.log
- Inject the Logger service in your constructors
- Use appropriate log levels:
  - `error`: For errors that need immediate attention
  - `warn`: For potentially harmful situations
  - `log`: For general information
  - `debug`: For detailed debugging information
  - `verbose`: For even more detailed debugging information

```typescript
// ✅ Correct
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async createUser(userData: CreateUserRequestDto): Promise<User> {
    try {
      this.logger.log('Creating new user');
      // Implementation
      this.logger.debug('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw error;
    }
  }
}

// ❌ Incorrect
@Injectable()
export class UserService {
  async createUser(userData: CreateUserRequestDto): Promise<User> {
    try {
      console.log('Creating new user');
      // Implementation
      console.log('User created successfully');
      return user;
    } catch (error) {
      console.error('Failed to create user', error);
      throw error;
    }
  }
}
```

#### Logging Context

- Always provide meaningful context in log messages
- Include relevant IDs and metadata
- Structure error logs with both message and stack trace

```typescript
// ✅ Correct
this.logger.log('User login attempt', { userId, ipAddress });
this.logger.error('Payment processing failed', {
  orderId,
  amount,
  error: error.message,
  stack: error.stack,
});

// ❌ Incorrect
this.logger.log('User logged in');
this.logger.error('Payment failed');
```

#### Logging in Development Scripts

For development scripts (e.g., setup scripts, migrations), use:

- `Logger` from `@nestjs/common` for TypeScript files
- `pino` or other configured logger for JavaScript files
- If neither is available, use `console.warn` or `console.error` (allowed by ESLint)
