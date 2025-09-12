import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { AuthProvider, UserStatus, UserRole } from '@/auth/enums';

export class UserResponseDto {
  @ApiProperty({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'أحمد محمد' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: '+96512345678', nullable: true })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Kuwait', nullable: true })
  @Expose()
  country?: string;

  @ApiProperty({ example: 'https://avatar.url/user.jpg', nullable: true })
  @Expose()
  avatar?: string;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.EMAIL })
  @Expose()
  provider: AuthProvider;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  @Expose()
  status: UserStatus;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: true })
  @Expose()
  emailVerified: boolean;

  @ApiProperty({ example: false })
  @Expose()
  twoFactorEnabled: boolean;

  @ApiProperty({ example: '2023-10-01T10:30:00.000Z', nullable: true })
  @Expose()
  lastLoginAt?: Date;

  @ApiProperty({ example: '2023-10-01T10:30:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-10-01T10:30:00.000Z' })
  @Expose()
  updatedAt: Date;

  // Explicitly exclude sensitive fields
  @Exclude()
  passwordHash?: string;

  @Exclude()
  providerId?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @Expose()
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @Expose()
  refreshToken: string;

  @ApiProperty({ example: 'Bearer' })
  @Expose()
  tokenType: string;

  @ApiProperty({ example: 3600 })
  @Expose()
  expiresIn: number;

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  user: UserResponseDto;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}

export class MessageResponseDto {
  @ApiProperty({ example: 'OTP sent successfully' })
  @Expose()
  message: string;

  @ApiProperty({ example: true })
  @Expose()
  success: boolean;

  constructor(message: string, success: boolean = true) {
    this.message = message;
    this.success = success;
  }
}
