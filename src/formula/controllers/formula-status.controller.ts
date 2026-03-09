import { ArchivedFormulaResponseDto } from '@/archived-formula/dto/archived-formula-response.dto';
import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos/responses';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Body, Controller, Param, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DestroyEggsRequestDto } from '../dto/requests';
import { FormulaResponseDto } from '../dto/responses';
import { FormulaService } from '../services';

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

  @Put(':id/eggs/:eggId/transform')
  @ApiOperation({ summary: 'Transform an egg to a pigeon; if last chick is registered, formula is archived' })
  @ApiDataResponse(FormulaResponseDto)
  async transformEggToPigeon(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('eggId', ParseUUIDPipe) eggId: string,
    @Body('pigeonId') pigeonId: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<FormulaResponseDto | ArchivedFormulaResponseDto>> {
    const result = await this.formulaService.transformEggToPigeon(id, eggId, pigeonId, userId);
    if ('archived' in result) {
      return ResponseFactory.data(new ArchivedFormulaResponseDto(result.archived));
    }
    return ResponseFactory.data(new FormulaResponseDto(result.formula));
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
