import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormulaResponseDto } from '../dto/responses';
import { FormulaService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Formula Search')
@Controller('formulas')
export class FormulaSearchController {
  constructor(private readonly formulaService: FormulaService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search formulas' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async searchFormulas(
    @Query('q') query: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(query, userId);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }

  @Get('box/:boxNumber')
  @ApiOperation({ summary: 'Get formula by box number' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulasByBoxNumber(
    @Param('boxNumber') boxNumber: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(boxNumber, userId);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }

  @Get('year/:yearOfFormula')
  @ApiOperation({ summary: 'Get formulas by year' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulasByYear(
    @Query('yearOfFormula') yearOfFormula: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(yearOfFormula, userId);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }
}
