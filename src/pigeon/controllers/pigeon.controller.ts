import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PigeonParentService, PigeonService } from '../services';
import { CreatePigeonRequestDto, UpdatePigeonRequestDto } from '../dto/requests';
import { PigeonResponseDto, PigeonDetailsResponseDto } from '../dto/responses';
import { IAliveParentsResult } from '../interfaces';
import { PageOptionsRequestDto } from '@/core/dtos';
import { ApiDataResponse, ApiDataPageResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto, DataPageResponseDto } from '@/core/dtos';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '@/user/decorators';

@ApiTags('Pigeons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pigeons')
export class PigeonController {
  private readonly logger = new Logger(PigeonController.name);

  constructor(
    private readonly pigeonService: PigeonService,
    private readonly pigeonParentService: PigeonParentService,
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
  @ApiDataPageResponse(PigeonResponseDto)
  async findAll(
    @Query() pageOptions: PageOptionsRequestDto,
    @UserId() userId: string,
  ): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const { items, total } = await this.pigeonService.findAll(pageOptions, userId);

    const response = ResponseFactory.dataPage(
      items.map((pigeon) => new PigeonResponseDto(pigeon)),
      {
        page: pageOptions.page,
        size: pageOptions.size,
        itemCount: total,
      },
    );
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pigeon by ID' })
  @ApiParam({
    name: 'id',
    description: 'Pigeon ID',
    type: String,
  })
  @ApiDataResponse(PigeonDetailsResponseDto)
  async findOne(@Param('id') id: string, @UserId() userId: string): Promise<DataResponseDto<PigeonDetailsResponseDto>> {
    const pigeon = await this.pigeonService.findOne(id, userId);
    return ResponseFactory.data(new PigeonDetailsResponseDto(pigeon));
  }

  @Patch(':id')
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
