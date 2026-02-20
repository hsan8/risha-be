import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse, ApiDataResponse } from '@/core/decorators/api';
import { DataArrayResponseDto, DataResponseDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ArchivePigeonRequestDto } from '../dto/requests';
import { ArchivedPigeonResponseDto } from '../dto/responses';
import { ArchivedPigeonService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Archived Pigeons')
@Controller('archived-pigeons')
export class ArchivedPigeonController {
  constructor(private readonly archivedPigeonService: ArchivedPigeonService) {}

  @Get()
  @ApiOperation({ summary: 'Get all archived pigeons for the current user' })
  @ApiDataArrayResponse(ArchivedPigeonResponseDto)
  async findAll(@UserId() userId: string): Promise<DataArrayResponseDto<ArchivedPigeonResponseDto>> {
    const list = await this.archivedPigeonService.findAll(userId);

    return ResponseFactory.dataArray(list.map((a) => new ArchivedPigeonResponseDto(a)));
  }

  @Post('pigeon/:pigeonId/archive')
  @ApiOperation({
    summary: 'Archive a pigeon (sell, gift, transfer ownership, or mark as dead)',
    description:
      'Moves the pigeon to archived collection and removes it from active pigeons. Tracking stops after this.',
  })
  @ApiParam({ name: 'pigeonId', description: 'Pigeon ID to archive', type: String })
  @ApiDataResponse(ArchivedPigeonResponseDto)
  async archivePigeon(
    @Param('pigeonId') pigeonId: string,
    @Body() dto: ArchivePigeonRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<ArchivedPigeonResponseDto>> {
    const archived = await this.archivedPigeonService.archivePigeon(pigeonId, userId, dto);
    return ResponseFactory.data(new ArchivedPigeonResponseDto(archived));
  }
}
