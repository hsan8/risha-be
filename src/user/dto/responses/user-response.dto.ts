import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AuthProvider, UserStatus, UserRole } from '@/auth/enums';

export class UserResponseDto {
  @ApiProperty({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  id: string;

  @ApiProperty({ example: 'أحمد محمد' })
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '+96512345678', nullable: true })
  phone?: string;

  @ApiProperty({ example: 'Kuwait', nullable: true })
  country?: string;

  @ApiProperty({ example: 'https://avatar.url/user.jpg', nullable: true })
  avatar?: string;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.EMAIL })
  provider: AuthProvider;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ example: true })
  emailVerified: boolean;

  @ApiProperty({ example: '2023-10-01T10:30:00.000Z', nullable: true })
  lastLoginAt?: Date;

  constructor(partial: Partial<UserResponseDto>) {
    this.id = partial.id;
    this.name = partial.name;
    this.email = partial.email;
    this.phone = partial.phone;
    this.country = partial.country;
    this.avatar = partial.avatar;
    this.provider = partial.provider;
    this.status = partial.status;
    this.role = partial.role;
    this.emailVerified = partial.emailVerified;
    this.lastLoginAt = partial.lastLoginAt;
  }
}
