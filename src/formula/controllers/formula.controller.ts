import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormulaService } from '../services';
import { CreateFormulaRequestDto } from '../dto/requests';
import { FormulaResponseDto } from '../dto/responses';
import { ApiDataResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { ResponseFactory } from '@/core/utils';

@ApiTags('Formula')
@Controller('formula')
export class FormulaController {
  constructor(private readonly formulaService: FormulaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new formula' })
  @ApiDataResponse(FormulaResponseDto)
  async createFormula(@Body() createFormulaDto: CreateFormulaRequestDto): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.createFormula(createFormulaDto);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a formula by ID' })
  @ApiDataResponse(FormulaResponseDto)
  async getFormula(@Param('id', ParseUUIDPipe) id: string): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.getFormulaById(id);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

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
