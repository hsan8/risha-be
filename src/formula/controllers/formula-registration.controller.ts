import { ArchivedFormulaResponseDto } from '@/archived-formula/dto/archived-formula-response.dto';
import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse, ApiDataResponse } from '@/core/decorators';
import { DataResponseDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { CreateFormulaRequestDto, UpdateFormulaRequestDto } from '@/formula/dto/requests';
import { FormulaResponseDto } from '@/formula/dto/responses';
import { FormulaService } from '@/formula/services';
import { UserId } from '@/user/decorators';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Formula Registration')
@Controller('formulas')
export class FormulaRegistrationController {
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

  @Get()
  @ApiOperation({ summary: 'Get all formulas' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulas(@UserId() userId: string) {
    const formulas = await this.formulaService.getFormulas(userId);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
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

  @Put(':id')
  @ApiOperation({ summary: 'Update a formula (e.g. boxNumber, yearOfFormula)' })
  @ApiDataResponse(FormulaResponseDto)
  async updateFormula(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFormulaRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.updateFormula(id, dto, userId);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive a formula (move to archived formulas)' })
  @ApiDataResponse(ArchivedFormulaResponseDto)
  async archiveFormula(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<ArchivedFormulaResponseDto>> {
    const archived = await this.formulaService.archiveFormula(id, userId);
    return ResponseFactory.data(new ArchivedFormulaResponseDto(archived));
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of formulas' })
  @ApiDataResponse(Number)
  async getCount(@UserId() userId: string): Promise<DataResponseDto<number>> {
    const count = await this.formulaService.getFormulaCount(userId);
    return ResponseFactory.data(count);
  }

  @Get('count/:status')
  @ApiOperation({ summary: 'Get count of formulas by status' })
  @ApiDataResponse(Number)
  async getCountByStatus(@Param('status') status: string, @UserId() userId: string): Promise<DataResponseDto<number>> {
    const count = await this.formulaService.getFormulaCountByStatus(status as any, userId);
    return ResponseFactory.data(count);
  }
}
