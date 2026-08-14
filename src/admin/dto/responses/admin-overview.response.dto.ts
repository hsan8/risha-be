import { ApiProperty } from '@nestjs/swagger';

export class AdminOverviewResponseDto {
  @ApiProperty({ example: 120 })
  totalUsers: number;

  @ApiProperty({ example: 4500 })
  totalPigeons: number;

  @ApiProperty({ example: 800 })
  totalFormulas: number;

  @ApiProperty({ example: 90 })
  totalArchivedPigeons: number;

  @ApiProperty({ example: 12 })
  totalArchivedFormulas: number;

  @ApiProperty({ example: 5 })
  totalNewsItems: number;

  constructor(partial: Partial<AdminOverviewResponseDto>) {
    Object.assign(this, partial);
  }
}
