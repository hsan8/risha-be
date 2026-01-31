import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { HistoryService } from '../services';
import { CreateHistoryEventRequestDto } from '../dto/requests';
import { HistoryEventResponseDto } from '../dto/responses';
import { ApiDataResponse, ApiDataArrayResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto, DataArrayResponseDto } from '@/core/dtos';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '@/user/decorators';
import { Language } from '@/core/decorators';
import { UserLocale } from '@/core/enums';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Pigeon History')
@Controller('pigeons')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':pigeonId/history')
  @ApiOperation({ summary: 'Get history timeline for a pigeon' })
  @ApiParam({ name: 'pigeonId', description: 'Pigeon ID', type: String })
  @ApiDataArrayResponse(HistoryEventResponseDto)
  async getHistory(
    @Param('pigeonId') pigeonId: string,
    @UserId() userId: string,
    @Language() locale: UserLocale,
  ): Promise<DataArrayResponseDto<HistoryEventResponseDto>> {
    const events = await this.historyService.findByPigeonId(userId, pigeonId);
    const labels = events.map(
      (e) => new HistoryEventResponseDto(e, this.historyService.getEventLabel(e.eventType, locale)),
    );
    return ResponseFactory.dataArray(labels);
  }
}
