import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PigeonService } from '../services';
import { PigeonResponseDto } from '../dto/responses';
import { ApiDataPageResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataPageResponseDto } from '@/core/dtos';
import { PageOptionsRequestDto } from '@/core/dtos';

@ApiTags('Pigeon Parents')
@Controller('pigeons/parents')
export class PigeonParentController {
  constructor(private readonly pigeonService: PigeonService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alive parent pigeons' })
  @ApiDataPageResponse(PigeonResponseDto)
  async findAliveParents(@Query() pageOptions: PageOptionsRequestDto): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const result = await this.pigeonService.findAliveParents();
    return ResponseFactory.dataPage(
      [
        ...result.fathers.map((pigeon) => new PigeonResponseDto(pigeon)),
        ...result.mothers.map((pigeon) => new PigeonResponseDto(pigeon)),
      ],
      {
        page: pageOptions.page,
        size: pageOptions.size,
        itemCount: result.fathers.length + result.mothers.length,
      },
    );
  }
}
