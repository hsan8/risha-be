import { ArchivedFormulaResponseDto } from '@/archived-formula/dto/archived-formula-response.dto';
import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFormulaRequestDto, DestroyEggsRequestDto } from '../dto/requests';
import { FormulaResponseDto } from '../dto/responses';
import { FormulaService } from '../services';

@ApiTags('Formula')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('formula')
export class FormulaController {
  constructor(private readonly formulaService: FormulaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new formula' })
  @ApiDataResponse(FormulaResponseDto)
  async createFormula(
    @Body() createFormulaDto: CreateFormulaRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.createFormula(createFormulaDto, userId);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a formula by ID' })
  @ApiDataResponse(FormulaResponseDto)
  async getFormula(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.getFormulaById(id, userId);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

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

  @Put(':id/eggs/destroy')
  @ApiOperation({ summary: 'Destroy one or two eggs; if all eggs destroyed, formula is ended and archived' })
  @ApiDataResponse(FormulaResponseDto)
  async destroyEggs(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DestroyEggsRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto | ArchivedFormulaResponseDto>> {
    const result = await this.formulaService.destroyEggs(id, dto, userId);
    if ('archived' in result) {
      return ResponseFactory.data(new ArchivedFormulaResponseDto(result.archived));
    }
    return ResponseFactory.data(new FormulaResponseDto(result.formula));
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
