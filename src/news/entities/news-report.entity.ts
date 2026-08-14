import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';
import { ReportReason } from '../dto/requests/report-news-item.request.dto';

export class NewsReport {
  @ApiProperty({ description: 'Unique identifier (UUID)' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ description: 'ID of the reported news item' })
  @IsString()
  newsItemId: string;

  @ApiProperty({ description: 'ID of the user who submitted the report' })
  @IsString()
  reportedByUserId: string;

  @ApiProperty({ description: 'Reason for the report', enum: ReportReason })
  @IsEnum(ReportReason)
  reason: ReportReason;

  @ApiProperty({ description: 'When the report was submitted' })
  @IsDate()
  createdAt: Date;
}
