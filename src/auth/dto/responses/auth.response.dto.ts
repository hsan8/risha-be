import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserResponseDto } from '@/user/dto/responses';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: 3600 })
  expiresIn: number;

  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  constructor(partial: Partial<AuthResponseDto>) {
    this.accessToken = partial.accessToken;
    this.refreshToken = partial.refreshToken;
    this.tokenType = partial.tokenType;
    this.expiresIn = partial.expiresIn;
    this.user = partial.user ? new UserResponseDto(partial.user) : undefined;
  }
}

export class MessageResponseDto {
  @ApiProperty({ example: 'OTP sent successfully' })
  message: string;

  @ApiProperty({ example: true })
  success: boolean;

  constructor(message: string, success: boolean = true) {
    this.message = message;
    this.success = success;
  }
}
