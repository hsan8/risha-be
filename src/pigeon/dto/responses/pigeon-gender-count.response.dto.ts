import { PigeonStatistics } from '@/user/entities';
import { ApiProperty } from '@nestjs/swagger';

export class PigeonGenderAliveCountResponseDto {
  @ApiProperty({ description: 'Number of male pigeons that are alive', example: 10 })
  maleCount: number;

  @ApiProperty({ description: 'Number of female pigeons that are alive', example: 8 })
  femaleCount: number;

  @ApiProperty({ description: 'Total number of alive pigeons', example: 18 })
  totalCount: number;

  @ApiProperty({ description: 'Last updated date', example: '2025-01-01' })
  lastUpdated: Date;

  constructor(data: PigeonStatistics) {
    this.maleCount = data.maleCount;
    this.femaleCount = data.femaleCount;
    this.totalCount = data.totalCount;
    this.lastUpdated = data.lastUpdated;
  }
}
