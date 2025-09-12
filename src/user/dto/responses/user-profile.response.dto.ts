import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserStatus, UserRole } from '@/auth/enums';
import { User } from '@/user/entities';

export class UserProfileResponseDto {
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

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  @Expose()
  status: UserStatus;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: true })
  @Expose()
  emailVerified: boolean;

  @ApiProperty({ example: '2023-10-01T10:30:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-10-01T10:30:00.000Z' })
  @Expose()
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.country = user.country;
    this.avatar = user.avatar;
    this.status = user.status;
    this.role = user.role;
    this.emailVerified = user.emailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
