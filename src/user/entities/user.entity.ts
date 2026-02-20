import { AuthProvider, UserRole, UserStatus } from '@/auth/enums';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'User country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'User avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  @IsString()
  passwordHash?: string;

  @ApiProperty({ description: 'Authentication provider', enum: AuthProvider })
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiProperty({ description: 'User status', enum: UserStatus })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'Email verification status' })
  @IsBoolean()
  emailVerified: boolean;

  @ApiProperty({ description: 'Two-factor authentication enabled' })
  @IsBoolean()
  twoFactorEnabled: boolean;

  @ApiProperty({ description: 'Last login date', required: false })
  @IsOptional()
  @IsDate()
  lastLoginAt?: Date;

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  @IsDate()
  resetPasswordTokenExpiry?: Date;

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  @IsDate()
  emailVerificationTokenExpiry?: Date;

  @ApiProperty({ description: 'User creation date' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'User last update date' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: 'User deletion date', required: false })
  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
