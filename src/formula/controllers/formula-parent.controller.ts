import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormulaResponseDto } from '../dto/responses';
import { FormulaService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Formula Parents')
@Controller('formulas')
export class FormulaParentController {
  constructor(private readonly formulaService: FormulaService) {}

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Get formulas by parent ID' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulasByParentId(
    @Param('parentId') parentId: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(parentId, userId);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }

  @Get('parent/name/:parentName')
  @ApiOperation({ summary: 'Get formulas by parent name' })
  @ApiDataArrayResponse(FormulaResponseDto)
  async getFormulasByParentName(
    @Param('parentName') parentName: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto[]>> {
    const formulas = await this.formulaService.searchFormulas(parentName, userId);
    return ResponseFactory.data(formulas.map((formula) => new FormulaResponseDto(formula)));
  }
}
