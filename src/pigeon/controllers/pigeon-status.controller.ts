import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PigeonService } from '../services';
import { PigeonResponseDto } from '../dto/responses';
import { ApiDataResponse, ApiDataPageResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto, DataPageResponseDto } from '@/core/dtos';
import { PigeonStatus } from '../enums';
import { PageOptionsRequestDto } from '@/core/dtos';

@ApiTags('Pigeon Status')
@Controller('pigeons/status')
export class PigeonStatusController {
  constructor(private readonly pigeonService: PigeonService) {}

  @Get('alive')
  @ApiOperation({ summary: 'Get all alive pigeons' })
  @ApiDataPageResponse(PigeonResponseDto)
  async findAlivePigeons(@Query() pageOptions: PageOptionsRequestDto): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const pigeons = await this.pigeonService.findAlivePigeons();
    return ResponseFactory.dataPage(
      pigeons.map((pigeon) => new PigeonResponseDto(pigeon)),
      {
        page: pageOptions.page,
        size: pageOptions.size,
        itemCount: pigeons.length,
      },
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of pigeons' })
  @ApiDataResponse('number')
  async count(): Promise<DataResponseDto<number>> {
    const count = await this.pigeonService.count();
    return ResponseFactory.data(count);
  }

  @Get('count/:status')
  @ApiOperation({ summary: 'Get count of pigeons by status' })
  @ApiParam({
    name: 'status',
    description: 'Pigeon status',
    enum: PigeonStatus,
  })
  @ApiDataResponse('number')
  async countByStatus(@Param('status') status: PigeonStatus): Promise<DataResponseDto<number>> {
    const count = await this.pigeonService.countByStatus(status);
    return ResponseFactory.data(count);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pigeon status' })
  @ApiParam({
    name: 'id',
    description: 'Pigeon ID',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: PigeonStatus; deadAt?: string },
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.pigeonService.update(id, { status: body.status, deadAt: body.deadAt });
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }
}
