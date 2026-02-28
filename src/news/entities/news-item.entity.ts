import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';
import { NewsItemType } from '../enums';

export class NewsItem {
  @ApiProperty({ description: 'Unique identifier (UUID)' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ description: 'Type of news item', enum: NewsItemType })
  @IsEnum(NewsItemType)
  type: NewsItemType;

  @ApiProperty({ description: 'Date and time of the news item' })
  @IsDate()
  dateTime: Date;

  @ApiProperty({ description: 'News text content' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'When the record was last updated' })
  @IsDate()
  updatedAt: Date;
}
