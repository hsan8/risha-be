import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { OTPType } from '@/auth/enums';

export class OTP {
  @ApiProperty({ description: 'Unique identifier for the OTP' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'OTP code (5 digits)' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'OTP type', enum: OTPType })
  @IsEnum(OTPType)
  type: OTPType;

  @ApiProperty({ description: 'OTP expiry date' })
  @IsDate()
  expiresAt: Date;

  @ApiProperty({ description: 'Whether OTP has been used' })
  @IsBoolean()
  used: boolean;

  @ApiProperty({ description: 'Number of attempts made' })
  attempts: number;

  @ApiProperty({ description: 'OTP creation date' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'OTP usage date', required: false })
  @IsDate()
  usedAt?: Date;
}
