import { Body, Controller, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormulaService } from '../services';
import { FormulaResponseDto } from '../dto/responses';
import { ApiDataResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { ResponseFactory } from '@/core/utils';

@ApiTags('Formula Status')
@Controller('formulas')
export class FormulaStatusController {
  constructor(private readonly formulaService: FormulaService) {}

  @Put(':id/egg')
  @ApiOperation({ summary: 'Add an egg to the formula' })
  @ApiDataResponse(FormulaResponseDto)
  async addEgg(@Param('id', ParseUUIDPipe) id: string): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.addEgg(id);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Put(':id/egg/:eggId/transform')
  @ApiOperation({ summary: 'Transform an egg to a pigeon' })
  @ApiDataResponse(FormulaResponseDto)
  async transformEggToPigeon(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('eggId', ParseUUIDPipe) eggId: string,
    @Body('pigeonId', ParseUUIDPipe) pigeonId: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.transformEggToPigeon(id, eggId, pigeonId);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Put(':id/terminate')
  @ApiOperation({ summary: 'Terminate a formula' })
  @ApiDataResponse(FormulaResponseDto)
  async terminateFormula(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.terminateFormula(id, reason);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }
}
