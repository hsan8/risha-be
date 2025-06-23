import { ApiProperty } from '@nestjs/swagger';

export class DataResponseDto<T> {
  @ApiProperty()
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }
}
