import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PigeonService } from '../services';
import { CreatePigeonRequestDto, UpdatePigeonRequestDto } from '../dto/requests';
import { PigeonResponseDto, PigeonDetailsResponseDto } from '../dto/responses';
import { PageOptionsRequestDto } from '@/core/dtos';
import { PigeonStatus } from '../enums';
import { ApiDataResponse, ApiDataArrayResponse, ApiDataPageResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto, DataArrayResponseDto, DataPageResponseDto } from '@/core/dtos';

@ApiTags('Pigeons')
@Controller('pigeons')
export class PigeonController {
  constructor(private readonly pigeonService: PigeonService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pigeon' })
  @ApiDataResponse(PigeonResponseDto, HttpStatus.CREATED)
  async create(@Body() createPigeonDto: CreatePigeonRequestDto): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.pigeonService.create(createPigeonDto);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }

  @Get()
  @ApiOperation({ summary: 'Get all pigeons' })
  @ApiDataPageResponse(PigeonResponseDto)
  async findAll(@Query() pageOptions: PageOptionsRequestDto): Promise<DataPageResponseDto<PigeonResponseDto>> {
    this.logger.log('🐦 PigeonController.findAll - Starting');
    this.logger.log('🐦 Page options:', pageOptions);

    try {
      this.logger.log('🐦 Calling pigeonService.findAll...');
      const { items, total } = await this.pigeonService.findAll(pageOptions);
      this.logger.log('🐦 Service returned:', { itemsCount: items.length, total });

      const response = ResponseFactory.dataPage(
        items.map((pigeon) => new PigeonResponseDto(pigeon)),
        {
          page: pageOptions.page,
          size: pageOptions.size,
          itemCount: total,
        },
      );
      this.logger.log('🐦 Returning response');
      return response;
    } catch (error) {
      this.logger.error('🐦 Error in findAll:', error);
      throw error;
    }
  }

  @Get('alive')
  @ApiOperation({ summary: 'Get all alive pigeons' })
  @ApiDataArrayResponse(PigeonResponseDto)
  async findAlivePigeons(@Query() pageOptions: PageOptionsRequestDto): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const pigeons = await this.pigeonService.findAlivePigeons();
    return ResponseFactory.dataPage(
      pigeons.map((pigeon) => new PigeonResponseDto(pigeon)),
      {
        page: pageOptions.page,
        size: pageOptions.size,
        itemCount: pigeons.length,
      },
    );
  }

  @Get('parents')
  @ApiOperation({ summary: 'Get all alive parent pigeons' })
  @ApiDataResponse(Object)
  async findAliveParents(@Query() pageOptions: PageOptionsRequestDto): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const result = await this.pigeonService.findAliveParents();
    return ResponseFactory.dataPage(
      [
        ...result.fathers.map((pigeon) => new PigeonResponseDto(pigeon)),
        ...result.mothers.map((pigeon) => new PigeonResponseDto(pigeon)),
      ],
      {
        page: pageOptions.page,
        size: pageOptions.size,
        itemCount: result.fathers.length + result.mothers.length,
      },
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of pigeons' })
  @ApiDataResponse('number')
  async count(): Promise<DataResponseDto<number>> {
    const count = await this.pigeonService.count();
    return ResponseFactory.data(count);
  }

  @Get('count/:status')
  @ApiOperation({ summary: 'Get count of pigeons by status' })
  @ApiParam({
    name: 'status',
    description: 'Pigeon status',
    enum: PigeonStatus,
  })
  @ApiDataResponse('number')
  async countByStatus(@Param('status') status: PigeonStatus): Promise<DataResponseDto<number>> {
    const count = await this.pigeonService.countByStatus(status);
    return ResponseFactory.data(count);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search pigeons by query' })
  @ApiQuery({
    name: 'q',
    description: 'Search query to filter pigeons',
    type: String,
  })
  @ApiDataArrayResponse(PigeonResponseDto)
  async search(@Query('q') query: string): Promise<DataArrayResponseDto<PigeonResponseDto>> {
    const pigeons = await this.pigeonService.search(query);
    return ResponseFactory.dataArray(pigeons.map((pigeon) => new PigeonResponseDto(pigeon)));
  }

  @Get('ring/:ringNo')
  @ApiOperation({ summary: 'Get a pigeon by ring number' })
  @ApiParam({
    name: 'ringNo',
    description: 'Pigeon ring number',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async findByRingNo(@Param('ringNo') ringNo: string): Promise<DataResponseDto<PigeonResponseDto | null>> {
    const pigeon = await this.pigeonService.findByRingNo(ringNo);
    return ResponseFactory.data(pigeon ? new PigeonResponseDto(pigeon) : null);
  }

  @Get('documentation/:documentationNo')
  @ApiOperation({ summary: 'Get a pigeon by documentation number' })
  @ApiParam({
    name: 'documentationNo',
    description: 'Pigeon documentation number',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async findByDocumentationNo(
    @Param('documentationNo') documentationNo: string,
  ): Promise<DataResponseDto<PigeonResponseDto | null>> {
    const pigeon = await this.pigeonService.findByDocumentationNo(documentationNo);
    return ResponseFactory.data(pigeon ? new PigeonResponseDto(pigeon) : null);
  }

  @Get('generate-registration/:yearOfBirth')
  @ApiOperation({ summary: 'Generate a registration number for a given year' })
  @ApiParam({
    name: 'yearOfBirth',
    description: 'Year of birth',
    type: String,
  })
  @ApiDataResponse('string')
  async generateRegistrationNumber(@Param('yearOfBirth') yearOfBirth: string): Promise<DataResponseDto<string>> {
    const registrationNumber = await this.pigeonService.generateRegistrationNumber(yearOfBirth);
    return ResponseFactory.data(registrationNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pigeon by ID' })
  @ApiParam({
    name: 'id',
    description: 'Pigeon ID',
    type: String,
  })
  @ApiDataResponse(PigeonDetailsResponseDto)
  async findOne(@Param('id') id: string): Promise<DataResponseDto<PigeonDetailsResponseDto>> {
    const pigeon = await this.pigeonService.findOne(id);
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
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.pigeonService.update(id, updatePigeonDto);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update pigeon status' })
  @ApiParam({
    name: 'id',
    description: 'Pigeon ID',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdatePigeonRequestDto,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.pigeonService.update(id, body);
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
  async remove(@Param('id') id: string): Promise<void> {
    await this.pigeonService.remove(id);
  }
}
