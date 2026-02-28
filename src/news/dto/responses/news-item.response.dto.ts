import { ApiProperty } from '@nestjs/swagger';
import { NewsItemType } from '../../enums';
import { NewsItem } from '../../entities';

export class NewsItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: NewsItemType })
  type: NewsItemType;

  @ApiProperty()
  dateTime: Date;

  @ApiProperty()
  description: string;

  @ApiProperty()
  updatedAt: Date;

  constructor(item: NewsItem) {
    this.id = item.id;
    this.type = item.type;
    this.dateTime = item.dateTime;
    this.description = item.description;
    this.updatedAt = item.updatedAt;
  }
}
