# DTO Rules

## General DTO Guidelines

### 1. File Naming Convention

- Use kebab-case for file names
- Include type suffix: `.request.dto.ts` or `.response.dto.ts`
- Example: `create-user-profile.request.dto.ts`

### 2. Class Naming Convention

- Use PascalCase for class names
- Include type suffix: `RequestDto` or `ResponseDto`
- Example: `CreateUserProfileRequestDto`

### 3. DTO Structure

#### Request DTOs

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { i18nValidationMessage as i18n } from 'nestjs-i18n';

export class CreateUserProfileRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString({
    message: i18n('validation.IsString', { path: 'app', property: 'user.name' }),
  })
  @IsNotEmpty({
    message: i18n('validation.IsNotEmpty', { path: 'app', property: 'user.name' }),
  })
  @Length(2, 50, {
    message: i18n('validation.Length', { path: 'app', property: 'user.name' }),
  })
  name!: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @Expose()
  @IsOptional()
  @IsEmail(
    {},
    {
      message: i18n('validation.IsEmail', { path: 'app', property: 'user.email' }),
    },
  )
  email?: string;
}
```

#### Response DTOs

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { User } from '~/users/entities';
import { UserLocale } from '~/core/enums';

export class UserDetailsResponseDto {
  @ApiProperty({ example: '119931' })
  userId: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com', nullable: true })
  email: string | null;

  constructor(user: User, locale: UserLocale) {
    this.userId = user.id;
    this.name = locale === UserLocale.ARABIC ? user.fullNameAr ?? '' : user.fullNameEn ?? '';
    this.email = user.email;
  }
}
```

### 4. Validation Rules

#### Use i18n for Validation Messages

```typescript
// ✅ Correct
@IsNotEmpty({
  message: i18n('validation.IsNotEmpty', { path: 'app', property: 'user.name' }),
})

// ❌ Incorrect
@IsNotEmpty({ message: 'Name is required' })
```

#### Common Validation Patterns

```typescript
// String validation
@IsString()
@IsNotEmpty()
@Length(min, max)

// Number validation
@IsNumber()
@Min(value)
@Max(value)

// Email validation
@IsEmail()

// UUID validation
@IsUUID()

// Enum validation
@IsEnum(EnumType)

// Optional fields
@IsOptional()
@ApiPropertyOptional()
```

### 5. Swagger Documentation

#### Required Properties

```typescript
@ApiProperty({ example: 'John Doe' })
name: string;
```

#### Optional Properties

```typescript
@ApiPropertyOptional({ example: 'john@example.com' })
email?: string;
```

#### Enum Properties

```typescript
@ApiProperty({ enum: UserLocale, example: UserLocale.ENGLISH })
locale: UserLocale;
```

#### Array Properties

```typescript
@ApiProperty({ type: [UserDetailsResponseDto] })
users: UserDetailsResponseDto[];
```

#### Nested Object Properties

```typescript
@ApiProperty({ type: () => UserDetailsResponseDto })
user: UserDetailsResponseDto;
```

### 6. Data Transformation

#### Using class-transformer

```typescript
import { Expose, Transform } from 'class-transformer';

export class CreateUserRequestDto {
  @Expose()
  @Transform(({ value }) => value?.trim?.() ?? value)
  @IsString()
  name!: string;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase?.() ?? value)
  @IsEmail()
  email!: string;
}
```

### 7. Inheritance Patterns

#### Base DTOs

```typescript
export class BaseResponseDto {
  @ApiProperty({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  id: string;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  createdAt: Date;
}
```

#### Extended DTOs

```typescript
export class ExtendedUserResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;
}
```

### 8. Generic DTOs

#### Data Response Wrapper

```typescript
export class DataResponseDto<T> {
  @ApiProperty()
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }
}
```

#### Array Response Wrapper

```typescript
export class DataArrayResponseDto<T> {
  @ApiProperty()
  readonly data: T[];

  constructor(data: T[]) {
    this.data = data;
  }
}
```

#### Paginated Response Wrapper

```typescript
export class DataPageResponseDto<T> extends DataArrayResponseDto<T> {
  @ApiProperty({ type: PageMetaResponseDto })
  readonly meta: PageMetaResponseDto;

  constructor(data: T[], meta: PageMetaResponseDto) {
    super(data);
    this.meta = meta;
  }
}
```

### 9. Export Patterns

#### Index Files

```typescript
// requests/index.ts
export * from './create-user.request.dto';
export * from './update-user.request.dto';

// responses/index.ts
export * from './user.response.dto';
export * from './user-details.response.dto';

// main index.ts
export * from './requests';
export * from './responses';
```

### 10. Constructor Patterns

#### Entity to DTO Transformation

```typescript
export class UserResponseDto {
  @ApiProperty({ example: '119931' })
  userId: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  constructor(user: User, locale: UserLocale) {
    this.userId = user.id;
    this.name = locale === UserLocale.ARABIC ? user.fullNameAr ?? '' : user.fullNameEn ?? '';
  }
}
```

#### Multiple Entity Transformation

```typescript
export class DashboardDataResponseDto {
  @ApiProperty({ type: () => DashboardBeneficiariesDto })
  beneficiariesInfo: DashboardBeneficiariesDto;

  @ApiProperty({ type: () => DashboardTransactionsDto })
  transactionsInfo: DashboardTransactionsDto;

  constructor({ beneficiaries, userTransactions }: IDashboardData, locale: UserLocale) {
    this.beneficiariesInfo = new DashboardBeneficiariesDto(beneficiaries);
    this.transactionsInfo = new DashboardTransactionsDto(userTransactions, locale);
  }
}
```
