import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormulaService } from '../services';
import { FormulaResponseDto } from '../dto/responses';
import { ApiDataArrayResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { ResponseFactory } from '@/core/utils';

@ApiTags('Formula Parents')
@Controller('formulas')
export class FormulaParentController {
  constructor(private readonly formulaService: FormulaService) {}

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Get formulas by parent ID' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulasByParentId(@Param('parentId') parentId: string): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(parentId);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }

  @Get('parent/name/:parentName')
  @ApiOperation({ summary: 'Get formulas by parent name' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulasByParentName(
    @Param('parentName') parentName: string,
  ): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(parentName);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }
}
