import { ApiProperty } from '@nestjs/swagger';

const MIN_PAGE = 1;

export interface IPageMeta {
  page: number;
  size: number;
  itemCount: number;
}

export class PageMetaResponseDto {
  @ApiProperty({ example: 1 })
  readonly page: number;

  @ApiProperty({ example: 10 })
  readonly size: number;

  @ApiProperty({ example: 15 })
  readonly itemCount: number;

  @ApiProperty({ example: 2 })
  readonly pageCount: number;

  @ApiProperty({ example: false })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ example: true })
  readonly hasNextPage: boolean;

  constructor({ page, size, itemCount }: IPageMeta) {
    this.page = +page;
    this.size = +size;
    this.itemCount = +itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.size);
    this.hasPreviousPage = this.page > MIN_PAGE;
    this.hasNextPage = this.page < this.pageCount;
  }
}
