import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse, ApiDataResponse } from '@/core/decorators/api';
import { DataArrayResponseDto, DataResponseDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { PigeonResponseDto } from '@/pigeon/dto/responses';
import { UserId } from '@/user/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove an archived pigeon record permanently',
    description:
      'Deletes the archive entry only. The pigeon is not restored to the active loft. Use POST .../restore to undo an archive.',
  })
  @ApiParam({ name: 'id', description: 'Archived pigeon record ID (UUID)', type: String })
  async deleteArchived(@Param('id', ParseUUIDPipe) id: string, @UserId() userId: string): Promise<void> {
    await this.archivedPigeonService.deleteArchived(id, userId);
  }

  @Post(':id/restore')
  @ApiOperation({
    summary: 'Rollback archiving',
    description:
      'Recreates the pigeon and its bundled history from the archive snapshot, updates loft statistics, and removes the archive record.',
  })
  @ApiParam({ name: 'id', description: 'Archived pigeon record ID (UUID)', type: String })
  @ApiDataResponse(PigeonResponseDto)
  async restoreArchived(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.archivedPigeonService.restoreArchived(id, userId);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }
}
