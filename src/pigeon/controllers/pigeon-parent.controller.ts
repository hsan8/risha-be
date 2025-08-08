import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PigeonService } from '../services';
import { PigeonResponseDto } from '../dto/responses';
import { ApiDataPageResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataPageResponseDto } from '@/core/dtos';
import { PageOptionsRequestDto } from '@/core/dtos';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '@/user/decorators';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Pigeon Parents')
@Controller('pigeons/parents')
export class PigeonParentController {
  constructor(private readonly pigeonService: PigeonService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alive parent pigeons' })
  @ApiDataPageResponse(PigeonResponseDto)
  async findAliveParents(
    @Query() pageOptions: PageOptionsRequestDto,
    @UserId() userId: string,
  ): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const result = await this.pigeonService.findAliveParents(userId);
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
