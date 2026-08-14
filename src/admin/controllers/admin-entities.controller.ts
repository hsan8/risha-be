import { JwtAuthGuard } from '@/auth/guards';
import { Language } from '@/core/decorators';
import { ApiDataArrayResponse, ApiDataPageResponse, ApiDataResponse } from '@/core/decorators/api';
import { DataArrayResponseDto, DataPageResponseDto, DataResponseDto, PageOptionsRequestDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { AdminGuard } from '@/admin/guards';
import { ArchivedFormulaResponseDto } from '@/archived-formula/dto/archived-formula-response.dto';
import { ArchivedPigeonResponseDto } from '@/archived-pigeon/dto/responses';
import { ArchivedFormulaService } from '@/archived-formula/services';
import { ArchivedPigeonService } from '@/archived-pigeon/services';
import { FormulaResponseDto } from '@/formula/dto/responses';
import { FormulaService } from '@/formula/services';
import { HistoryEventResponseDto } from '@/history/dto/responses';
import { HistoryService } from '@/history/services';
import { NewsItemResponseDto } from '@/news/dto/responses';
import { NewsService } from '@/news/services';
import { PigeonResponseDto } from '@/pigeon/dto/responses';
import { PigeonService } from '@/pigeon/services';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminEntitiesController {
  constructor(
    private readonly pigeonService: PigeonService,
    private readonly formulaService: FormulaService,
    private readonly archivedPigeonService: ArchivedPigeonService,
    private readonly archivedFormulaService: ArchivedFormulaService,
    private readonly historyService: HistoryService,
    private readonly newsService: NewsService,
  ) {}

  @Get('pigeons')
  @ApiOperation({ summary: 'List pigeons for any user (ownerUserId required)' })
  @ApiQuery({ name: 'ownerUserId', required: true })
  @ApiDataPageResponse(PigeonResponseDto)
  async listPigeons(
    @Query('ownerUserId', ParseUUIDPipe) ownerUserId: string,
    @Query() pageOptions: PageOptionsRequestDto,
  ): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const result = await this.pigeonService.findAll(pageOptions, ownerUserId);
    return ResponseFactory.dataPage(
      result.items.map((p) => new PigeonResponseDto(p)),
      {
        page: pageOptions.page,
        size: pageOptions.size,
        itemCount: result.total,
      },
    );
  }

  @Get('pigeons/:pigeonId')
  @ApiOperation({ summary: 'Get pigeon by id for a given owner (ownerUserId required)' })
  @ApiQuery({ name: 'ownerUserId', required: true })
  @ApiDataResponse(PigeonResponseDto)
  async getPigeon(
    @Query('ownerUserId', ParseUUIDPipe) ownerUserId: string,
    @Param('pigeonId', ParseUUIDPipe) pigeonId: string,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.pigeonService.findOne(pigeonId, ownerUserId);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }

  @Get('pigeons/:pigeonId/history')
  @ApiOperation({ summary: 'Pigeon history for any user (ownerUserId required)' })
  @ApiQuery({ name: 'ownerUserId', required: true })
  @ApiDataArrayResponse(HistoryEventResponseDto)
  async getPigeonHistory(
    @Query('ownerUserId', ParseUUIDPipe) ownerUserId: string,
    @Param('pigeonId', ParseUUIDPipe) pigeonId: string,
    @Language() locale: UserLocale,
  ): Promise<DataArrayResponseDto<HistoryEventResponseDto>> {
    const events = await this.historyService.findByPigeonId(ownerUserId, pigeonId);
    const labels = events.map(
      (e) => new HistoryEventResponseDto(e, this.historyService.getEventLabel(e.eventType, locale)),
    );
    return ResponseFactory.dataArray(labels);
  }

  @Get('formulas')
  @ApiOperation({ summary: 'List formulas for any user (ownerUserId required)' })
  @ApiQuery({ name: 'ownerUserId', required: true })
  @ApiDataArrayResponse(FormulaResponseDto)
  async listFormulas(
    @Query('ownerUserId', ParseUUIDPipe) ownerUserId: string,
  ): Promise<DataArrayResponseDto<FormulaResponseDto>> {
    const formulas = await this.formulaService.getFormulas(ownerUserId);
    return ResponseFactory.dataArray(formulas.map((f) => new FormulaResponseDto(f)));
  }

  @Get('formulas/:formulaId')
  @ApiOperation({ summary: 'Get formula by id for a given owner (ownerUserId required)' })
  @ApiQuery({ name: 'ownerUserId', required: true })
  @ApiDataResponse(FormulaResponseDto)
  async getFormula(
    @Query('ownerUserId', ParseUUIDPipe) ownerUserId: string,
    @Param('formulaId', ParseUUIDPipe) formulaId: string,
  ): Promise<DataResponseDto<FormulaResponseDto>> {
    const formula = await this.formulaService.getFormulaById(formulaId, ownerUserId);
    return ResponseFactory.data(new FormulaResponseDto(formula));
  }

  @Get('archived-pigeons')
  @ApiOperation({ summary: 'Archived pigeons for any user (ownerUserId required)' })
  @ApiQuery({ name: 'ownerUserId', required: true })
  @ApiDataArrayResponse(ArchivedPigeonResponseDto)
  async listArchivedPigeons(
    @Query('ownerUserId', ParseUUIDPipe) ownerUserId: string,
  ): Promise<DataArrayResponseDto<ArchivedPigeonResponseDto>> {
    const rows = await this.archivedPigeonService.findAll(ownerUserId);
    return ResponseFactory.dataArray(rows.map((r) => new ArchivedPigeonResponseDto(r)));
  }

  @Get('archived-formulas')
  @ApiOperation({ summary: 'Archived formulas for any user (ownerUserId required)' })
  @ApiQuery({ name: 'ownerUserId', required: true })
  @ApiDataArrayResponse(ArchivedFormulaResponseDto)
  async listArchivedFormulas(
    @Query('ownerUserId', ParseUUIDPipe) ownerUserId: string,
  ): Promise<DataArrayResponseDto<ArchivedFormulaResponseDto>> {
    const rows = await this.archivedFormulaService.findAll(ownerUserId);
    return ResponseFactory.dataArray(rows.map((r) => new ArchivedFormulaResponseDto(r)));
  }

  @Get('news')
  @ApiOperation({ summary: 'All news items (admin)' })
  @ApiDataArrayResponse(NewsItemResponseDto)
  async listNews(): Promise<DataArrayResponseDto<NewsItemResponseDto>> {
    const items = await this.newsService.findAll();
    return ResponseFactory.dataArray(items.map((n) => new NewsItemResponseDto(n)));
  }
}
