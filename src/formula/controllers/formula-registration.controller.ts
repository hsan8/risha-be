import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormulaService } from '../services';
import { CreateFormulaRequestDto } from '../dto';
import { FormulaResponseDto } from '../dto/responses';
import { ApiDataResponse, ApiDataArrayResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { PageOptionsRequestDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';

@ApiTags('Formula Registration')
@Controller('formulas')
export class FormulaRegistrationController {
  constructor(private readonly formulaService: FormulaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new formula' })
  @ApiDataResponse(FormulaResponseDto)
  async createFormula(@Body() createFormulaDto: CreateFormulaRequestDto): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.createFormula(createFormulaDto);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Get()
  @ApiOperation({ summary: 'Get all formulas' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulas(
    @Body() pageOptions: PageOptionsRequestDto,
  ): Promise<DataResponseDto<{ items: FormulaResponseDto[]; total: number }>> {
    const { items, total } = await this.formulaService.getFormulas(pageOptions);
    return ResponseFactory.data({
      items: items.map((formula) => new FormulaResponseDto(formula)),
      total,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a formula by ID' })
  @ApiDataResponse(FormulaResponseDto)
  async getFormula(@Param('id', ParseUUIDPipe) id: string): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.getFormulaById(id);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of formulas' })
  @ApiDataResponse(Number)
  async getCount(): Promise<DataResponseDto<number>> {
    const count = await this.formulaService.getFormulaCount();
    return ResponseFactory.data(count);
  }

  @Get('count/:status')
  @ApiOperation({ summary: 'Get count of formulas by status' })
  @ApiDataResponse(Number)
  async getCountByStatus(@Param('status') status: string): Promise<DataResponseDto<number>> {
    const count = await this.formulaService.getFormulaCountByStatus(status as any);
    return ResponseFactory.data(count);
  }
}
