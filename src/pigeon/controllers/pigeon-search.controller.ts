import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PigeonService } from '../services/pigeon.service';
import { PigeonResponseDto } from '../dto/responses';
import { ApiDataResponse, ApiDataArrayResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto, DataArrayResponseDto } from '@/core/dtos';

@ApiTags('Pigeon Search')
@Controller('pigeons/search')
export class PigeonSearchController {
  constructor(private readonly pigeonService: PigeonService) {}

  @Get()
  @ApiOperation({ summary: 'Search pigeons by query' })
  @ApiQuery({
    name: 'q',
    description: 'Search query to filter pigeons',
    type: String,
  })
  @ApiDataArrayResponse(PigeonResponseDto)
  async search(@Query('q') query: string): Promise<DataArrayResponseDto<PigeonResponseDto>> {
    const pigeons = await this.pigeonService.search(query);
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
  async findByRingNo(@Param('ringNo') ringNo: string): Promise<DataResponseDto<PigeonResponseDto | null>> {
    const pigeon = await this.pigeonService.findByRingNo(ringNo);
    return ResponseFactory.data(pigeon ? new PigeonResponseDto(pigeon) : null);
  }

  @Get('documentation/:documentationNo')
  @ApiOperation({ summary: 'Get a pigeon by documentation number' })
  @ApiParam({
    name: 'documentationNo',
    description: 'Pigeon documentation number',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async findByDocumentationNo(
    @Param('documentationNo') documentationNo: string,
  ): Promise<DataResponseDto<PigeonResponseDto | null>> {
    const pigeon = await this.pigeonService.findByDocumentationNo(documentationNo);
    return ResponseFactory.data(pigeon ? new PigeonResponseDto(pigeon) : null);
  }
}
