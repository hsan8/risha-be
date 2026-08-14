import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ReportReason {
  SPAM = 'spam',
  OFFENSIVE = 'offensive',
  MISINFORMATION = 'misinformation',
  OTHER = 'other',
}

export class ReportNewsItemRequestDto {
  @ApiProperty({
    enum: ReportReason,
    example: ReportReason.SPAM,
    description: 'Reason for reporting the content',
  })
  @IsEnum(ReportReason)
  @IsNotEmpty()
  reason!: ReportReason;
}
