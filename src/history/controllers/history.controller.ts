import { JwtAuthGuard } from '@/auth/guards';
import { Language } from '@/core/decorators';
import { ApiDataArrayResponse } from '@/core/decorators/api';
import { DataArrayResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HistoryEventResponseDto } from '../dto/responses';
import { HistoryService } from '../services';

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
