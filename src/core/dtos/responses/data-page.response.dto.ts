import { ApiProperty } from '@nestjs/swagger';
import { DataArrayResponseDto } from './data-array.response.dto';
import { PageMetaResponseDto } from './page-meta.response.dto';

export class DataPageResponseDto<T> extends DataArrayResponseDto<T> {
  @ApiProperty({ type: PageMetaResponseDto })
  readonly meta: PageMetaResponseDto;

  constructor(data: T[], meta: PageMetaResponseDto) {
    super(data);
    this.meta = meta;
  }
}
