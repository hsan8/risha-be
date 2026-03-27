import { JwtAuthGuard } from '@/auth/guards';
import { Language } from '@/core/decorators';
import { ApiDataArrayResponse } from '@/core/decorators/api';
import { DataArrayResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import {
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ArchivedFormulaResponseDto } from '../dto/archived-formula-response.dto';
import { ArchivedFormulaPdfService, ArchivedFormulaService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Archived Formulas')
@Controller('archived-formulas')
export class ArchivedFormulaController {
  constructor(
    private readonly archivedFormulaService: ArchivedFormulaService,
    private readonly archivedFormulaPdfService: ArchivedFormulaPdfService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all archived formulas for the current user' })
  @ApiDataArrayResponse(ArchivedFormulaResponseDto)
  async findAll(@UserId() userId: string): Promise<DataArrayResponseDto<ArchivedFormulaResponseDto>> {
    const list = await this.archivedFormulaService.findAll(userId);

    return ResponseFactory.dataArray(list.map((a) => new ArchivedFormulaResponseDto(a)));
  }

  @Get('report')
  @ApiOperation({ summary: 'Render an HTML report for all archived formulas' })
  @ApiProduces('text/html')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async renderHtmlReport(
    @UserId() userId: string,
    @Language() locale: UserLocale,
    @Res() res: Response,
  ): Promise<void> {
    const archivedFormulas = await this.archivedFormulaService.findAll(userId);
    const html = await this.archivedFormulaPdfService.generateAllHtml(archivedFormulas, locale);
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Language': locale,
    });
    res.send(Buffer.from(html, 'utf8'));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an archived formula permanently' })
  @ApiParam({ name: 'id', description: 'Archived formula ID (UUID)', type: String })
  async delete(@Param('id', ParseUUIDPipe) id: string, @UserId() userId: string): Promise<void> {
    await this.archivedFormulaService.delete(id, userId);
  }
}
