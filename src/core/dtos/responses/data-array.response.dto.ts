import { ApiProperty } from '@nestjs/swagger';

export class DataArrayResponseDto<T> {
  @ApiProperty()
  readonly data: T[];

  constructor(data: T[]) {
    this.data = data;
  }
}
