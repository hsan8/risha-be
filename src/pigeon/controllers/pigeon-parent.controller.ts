import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataPageResponse } from '@/core/decorators/api';
import { DataPageResponseDto, PageOptionsRequestDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PigeonResponseDto } from '../dto/responses';
import { PigeonParentService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Pigeon Parents')
@Controller('pigeons-parents')
export class PigeonParentController {
  constructor(private readonly pigeonParentService: PigeonParentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alive parent pigeons' })
  @ApiDataPageResponse(PigeonResponseDto)
  async findAliveParents(
    @Query() pageOptions: PageOptionsRequestDto,
    @UserId() userId: string,
  ): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const result = await this.pigeonParentService.findAliveParents(userId);
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
