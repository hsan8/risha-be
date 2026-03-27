import { JwtAuthGuard } from '@/auth/guards';
import { Language } from '@/core/decorators';
import { ApiDataArrayResponse, ApiDataResponse, ApiXLanguageHeader } from '@/core/decorators/api';
import { DataArrayResponseDto, DataResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreatePigeonRequestDto, UpdatePigeonRequestDto } from '../dto/requests';
import { PigeonChildResponseDto, PigeonResponseDto } from '../dto/responses';
import { PigeonService, PigeonShareCardService } from '../services';

@ApiTags('Pigeons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pigeons')
export class PigeonController {
  private readonly logger = new Logger(PigeonController.name);

  constructor(
    private readonly pigeonService: PigeonService,
    private readonly pigeonShareCardService: PigeonShareCardService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pigeon' })
  @ApiDataResponse(PigeonResponseDto, HttpStatus.CREATED)
  async create(
    @Body() createPigeonDto: CreatePigeonRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.pigeonService.create(createPigeonDto, userId);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }

  @Get()
  @ApiOperation({ summary: 'Get all pigeons' })
  @ApiDataArrayResponse(PigeonResponseDto)
  async findAll(@UserId() userId: string): Promise<DataArrayResponseDto<PigeonResponseDto>> {
    const items = await this.pigeonService.findAllPigeonsByUserId(userId);
    return ResponseFactory.dataArray(items.map((pigeon) => new PigeonResponseDto(pigeon)));
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get children of a pigeon (pigeons where this pigeon is father or mother)' })
  @ApiParam({ name: 'id', description: 'Pigeon ID', type: String })
  @ApiDataArrayResponse(PigeonChildResponseDto)
  async getChildren(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<DataArrayResponseDto<PigeonChildResponseDto>> {
    const children = await this.pigeonService.getChildren(id, userId);
    return ResponseFactory.dataArray(children.map((p) => new PigeonChildResponseDto(p)));
  }

  @Get(':id/share-card')
  @ApiXLanguageHeader()
  @ApiOperation({ summary: 'HTML share card for a pigeon (for sharing details)' })
  @ApiProduces('text/html')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async shareCard(
    @Param('id') id: string,
    @UserId() userId: string,
    @Language() locale: UserLocale,
    @Res() res: Response,
  ): Promise<void> {
    const pigeon = await this.pigeonService.findOne(id, userId);
    const children = await this.pigeonService.getChildren(id, userId);
    const html = this.pigeonShareCardService.generateHtml(pigeon, children, locale);
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Language': locale,
    });
    res.send(Buffer.from(html, 'utf8'));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pigeon by ID' })
  @ApiParam({
    name: 'id',
    description: 'Pigeon ID',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async findOne(@Param('id') id: string, @UserId() userId: string) {
    const pigeon = await this.pigeonService.findOne(id, userId);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a pigeon' })
  @ApiParam({
    name: 'id',
    description: 'Pigeon ID',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async update(
    @Param('id') id: string,
    @Body() updatePigeonDto: UpdatePigeonRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.pigeonService.update(id, updatePigeonDto, userId);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a pigeon' })
  @ApiParam({
    name: 'id',
    description: 'Pigeon ID',
    type: String,
  })
  async remove(@Param('id') id: string, @UserId() userId: string): Promise<void> {
    await this.pigeonService.remove(id, userId);
  }
}
