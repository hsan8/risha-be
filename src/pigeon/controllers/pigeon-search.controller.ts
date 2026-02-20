import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse, ApiDataResponse } from '@/core/decorators';
import { DataArrayResponseDto, DataResponseDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { PigeonResponseDto } from '@/pigeon/dto/responses';
import { PigeonSearchService } from '@/pigeon/services';
import { UserId } from '@/user/decorators';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Pigeon Search')
@Controller('pigeons-search')
export class PigeonSearchController {
  constructor(private readonly pigeonSearchService: PigeonSearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search pigeons by query' })
  @ApiQuery({
    name: 'q',
    description: 'Search query to filter pigeons',
    type: String,
  })
  @ApiDataArrayResponse(PigeonResponseDto)
  async search(@Query('q') query: string, @UserId() userId: string): Promise<DataArrayResponseDto<PigeonResponseDto>> {
    const pigeons = await this.pigeonSearchService.search(query, userId);
    return ResponseFactory.dataArray(pigeons.map((pigeon) => new PigeonResponseDto(pigeon)));
  }

  @Get('ring/:ringNo')
  @ApiOperation({ summary: 'Get a pigeon by ring number' })
  @ApiParam({
    name: 'ringNo',
    description: 'Pigeon ring number',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async findByRingNo(
    @Param('ringNo') ringNo: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonResponseDto | null>> {
    const pigeon = await this.pigeonSearchService.findByRingNo(ringNo, userId);
    return ResponseFactory.data(pigeon ? new PigeonResponseDto(pigeon) : null);
  }
}
