import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { AuthProvider, UserStatus, UserRole } from '../enums/auth.enum';

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

  @ApiProperty({ description: 'User avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'Hashed password for email authentication', required: false })
  @IsOptional()
  @IsString()
  passwordHash?: string;

  @ApiProperty({ description: 'Authentication provider', enum: AuthProvider })
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @ApiProperty({ description: 'Provider specific user ID', required: false })
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

  @ApiProperty({ description: 'Password reset token', required: false })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

  @ApiProperty({ description: 'Password reset token expiry', required: false })
  @IsOptional()
  @IsDate()
  resetPasswordTokenExpiry?: Date;

  @ApiProperty({ description: 'Email verification token', required: false })
  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @ApiProperty({ description: 'Email verification token expiry', required: false })
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
