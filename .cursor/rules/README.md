# Cursor Rules for Remittance Microservice

This directory contains comprehensive coding rules and guidelines for the Remittance Microservice project. These rules are designed to maintain consistency, improve code quality, and ensure best practices across the codebase.

## 📁 Rules Overview

### 1. [Imports](./imports.md)

- **Always import from index files** when available
- Import order: External libraries → Internal modules → Relative imports
- Use `~` alias for src directory imports
- Barrel export patterns for clean imports

### 2. [DTOs](./dtos.md)

- File naming: kebab-case with type suffix (`.request.dto.ts`, `.response.dto.ts`)
- Class naming: PascalCase with type suffix (`RequestDto`, `ResponseDto`)
- Use i18n for validation messages
- Swagger documentation patterns
- Constructor patterns for entity transformation

### 3. [i18n](./i18n.md)

- File structure: `src/i18n/{lang}/{namespace}.json`
- Namespace organization: `app.json`, `general.json`, `validation.json`
- Property mapping structure for validation messages
- Usage patterns in DTOs, services, and controllers
- I18nContextWrapper for error handling

### 4. [Style](./style.md)

- Code formatting with Prettier and ESLint
- Naming conventions for files, classes, variables, and constants
- TypeScript best practices
- NestJS patterns for controllers and services
- Error handling and testing patterns

### 5. [Indexes](./indexes.md)

- **Always use barrel exports** for directories with multiple exports
- Directory structure patterns
- Export patterns by type (constants, DTOs, services, etc.)
- Import patterns from index files
- Module-level index organization

## 🎯 Key Principles

### 1. Consistency First

- Follow established patterns in the codebase
- Use consistent naming conventions
- Maintain uniform file and directory structures

### 2. Clean Imports

- **ALWAYS** import from index files when available
- Use barrel exports for organized imports
- Group imports logically (external → internal → relative)

### 3. Internationalization

- Use i18n for all user-facing messages
- Maintain consistent message structure
- Support multiple languages (en, ar, hi, ur, fi)

### 4. Type Safety

- Use TypeScript effectively
- Prefer named exports over default exports
- Use proper type annotations and interfaces

### 5. Documentation

- Use Swagger decorators for API documentation
- Include JSDoc comments for complex functions
- Maintain clear and descriptive naming

## 🏗️ Project Structure

```
src/
├── core/                    # Core utilities and shared code
│   ├── constants/          # Global constants
│   ├── decorators/         # Custom decorators
│   ├── dtos/              # Shared DTOs
│   ├── enums/             # Global enums
│   ├── guards/            # Custom guards
│   ├── interfaces/        # Shared interfaces
│   ├── utils/             # Utility functions
│   └── index.ts           # Barrel exports
├── common/                 # Common dependencies and utilities
│   ├── dependencies/      # External service integrations
│   ├── enums/            # Common enums
│   └── interfaces/       # Common interfaces
├── users/                  # User management module
├── beneficiaries/          # Beneficiary management module
├── transfers/             # Transfer operations module
├── transfer-methods/      # Transfer method configurations
├── auth/                  # Authentication module
├── aml/                   # Anti-money laundering module
├── i18n/                  # Internationalization files
└── main.ts               # Application entry point
```

## 🚀 Quick Start

### 1. Creating a New Module

```bash
# Create module structure
mkdir -p src/new-module/{constants,dtos/{requests,responses},entities,enums,interfaces,services}

# Create index files
touch src/new-module/{constants,dtos,dtos/requests,dtos/responses,entities,enums,interfaces,services}/index.ts
touch src/new-module/index.ts
```

### 2. Creating a New DTO

```typescript
// src/new-module/dtos/requests/create-item.request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class CreateItemRequestDto {
  @ApiProperty({ example: 'Item Name' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'item.name' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'item.name' }),
  })
  @Length(2, 100, {
    message: i18n('validation.Length', { path: 'app', property: 'item.name' }),
  })
  name!: string;

  @ApiPropertyOptional({ example: 'Item description' })
  @Expose()
  @IsOptional()
  @IsString()
  description?: string;
}
```

### 3. Updating Index Files

```typescript
// src/new-module/dtos/requests/index.ts
export * from './create-item.request.dto';
export * from './update-item.request.dto';

// src/new-module/dtos/index.ts
export * from './requests';
export * from './responses';

// src/new-module/index.ts
export * from './constants';
export * from './dtos';
export * from './entities';
export * from './enums';
export * from './interfaces';
export * from './services';
```

## 🔧 Tools and Configuration

### Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 120
}
```

### ESLint Rules

- No console statements
- No magic numbers
- Maximum line length: 120 characters
- Require await for async functions
- No underscore dangle

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "~/*": ["src/*"]
    },
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## 📋 Checklist for New Code

### Before Committing

- [ ] All imports use index files (when available)
- [ ] DTOs follow naming conventions and include proper validation
- [ ] i18n messages are used for all user-facing text
- [ ] Code follows style guidelines (Prettier + ESLint)
- [ ] Index files are updated with new exports
- [ ] Swagger documentation is included for APIs
- [ ] Tests are written and passing
- [ ] No console statements or magic numbers

### For New Features

- [ ] Create proper module structure with index files
- [ ] Add i18n messages for new features
- [ ] Include proper error handling with i18n
- [ ] Add Swagger documentation
- [ ] Write unit and integration tests
- [ ] Update relevant index files

## 🤝 Contributing

When contributing to this project:

1. **Read the rules** in this directory before starting
2. **Follow the established patterns** in the codebase
3. **Update index files** when adding new exports
4. **Use i18n** for all user-facing messages
5. **Maintain consistency** with existing code style
6. **Add tests** for new functionality
7. **Update documentation** as needed

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [nestjs-i18n Documentation](https://github.com/ToonvanStrijp/nestjs-i18n)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [class-transformer Documentation](https://github.com/typestack/class-transformer)

---

**Remember**: These rules are designed to maintain code quality and consistency. When in doubt, follow the existing patterns in the codebase and refer to these guidelines.
