import { ApiProperty } from '@nestjs/swagger';

export class PigeonCountByStatusResponseDto {
  @ApiProperty({ description: 'Total count of pigeons for the given status', example: 18 })
  total: number;

  @ApiProperty({ description: 'Count of male pigeons', example: 10 })
  maleCount: number;

  @ApiProperty({ description: 'Count of female pigeons', example: 8 })
  femaleCount: number;

  constructor(data: { total: number; maleCount: number; femaleCount: number }) {
    this.total = data.total;
    this.maleCount = data.maleCount;
    this.femaleCount = data.femaleCount;
  }
}
