import { Body, Controller, Param, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FormulaService } from '../services';
import { FormulaResponseDto } from '../dto/responses';
import { ApiDataResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { ResponseFactory } from '@/core/utils';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '@/user/decorators';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Formula Status')
@Controller('formulas')
export class FormulaStatusController {
  constructor(private readonly formulaService: FormulaService) {}

  @Put(':id/egg')
  @ApiOperation({ summary: 'Add an egg to the formula' })
  @ApiDataResponse(FormulaResponseDto)
  async addEgg(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.addEgg(id, userId);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Put(':id/egg/:eggId/transform')
  @ApiOperation({ summary: 'Transform an egg to a pigeon' })
  @ApiDataResponse(FormulaResponseDto)
  async transformEggToPigeon(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('eggId', ParseUUIDPipe) eggId: string,
    @Body('pigeonId', ParseUUIDPipe) pigeonId: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.transformEggToPigeon(id, eggId, pigeonId, userId);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Put(':id/terminate')
  @ApiOperation({ summary: 'Terminate a formula' })
  @ApiDataResponse(FormulaResponseDto)
  async terminateFormula(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.terminateFormula(id, reason, userId);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }
}
