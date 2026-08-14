import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class BlockedUser {
  @ApiProperty({ description: 'ID of the user who initiated the block' })
  @IsString()
  blockingUserId: string;

  @ApiProperty({ description: 'ID of the user being blocked' })
  @IsString()
  blockedUserId: string;

  @ApiProperty({ description: 'When the block was created' })
  @IsDate()
  createdAt: Date;
}
