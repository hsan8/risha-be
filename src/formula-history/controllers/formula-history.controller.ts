import { JwtAuthGuard } from '@/auth/guards';
import { Language } from '@/core/decorators';
import { ApiDataArrayResponse } from '@/core/decorators/api';
import { DataArrayResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FormulaHistoryEventResponseDto } from '../dto/responses';
import { FormulaHistoryService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Formula History')
@Controller('formulas')
export class FormulaHistoryController {
  constructor(private readonly formulaHistoryService: FormulaHistoryService) {}

  @Get(':formulaId/history')
  @ApiOperation({ summary: 'Get history timeline for a formula' })
  @ApiParam({ name: 'formulaId', description: 'Formula ID (UUID)', type: String })
  @ApiDataArrayResponse(FormulaHistoryEventResponseDto)
  async getHistory(
    @Param('formulaId', ParseUUIDPipe) formulaId: string,
    @UserId() userId: string,
    @Language() locale: UserLocale,
  ): Promise<DataArrayResponseDto<FormulaHistoryEventResponseDto>> {
    const events = await this.formulaHistoryService.findByFormulaId(userId, formulaId);
    const labels = events.map(
      (e) => new FormulaHistoryEventResponseDto(e, this.formulaHistoryService.getEventLabel(e.action, locale)),
    );
    return ResponseFactory.dataArray(labels);
  }
}
