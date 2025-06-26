import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormulaService } from '../services';
import { ApiDataArrayResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto } from '@/core/dtos/responses';
import { FormulaResponseDto } from '../dto/responses';

@ApiTags('Formula Search')
@Controller('formulas')
export class FormulaSearchController {
  constructor(private readonly formulaService: FormulaService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search formulas' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async searchFormulas(@Query('q') query: string): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(query);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }

  @Get('case/:caseNumber')
  @ApiOperation({ summary: 'Get formula by case number' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulasByCaseNumber(
    @Query('caseNumber') caseNumber: string,
  ): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(caseNumber);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }

  @Get('year/:yearOfFormula')
  @ApiOperation({ summary: 'Get formulas by year' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulasByYear(
    @Query('yearOfFormula') yearOfFormula: string,
  ): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(yearOfFormula);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }
}
