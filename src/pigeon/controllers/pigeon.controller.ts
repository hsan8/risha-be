import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse, ApiDataPageResponse, ApiDataResponse } from '@/core/decorators/api';
import { DataArrayResponseDto, DataPageResponseDto, DataResponseDto, PageOptionsRequestDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreatePigeonRequestDto, UpdatePigeonRequestDto } from '../dto/requests';
import { PigeonChildResponseDto, PigeonResponseDto } from '../dto/responses';
import { PigeonService } from '../services';

@ApiTags('Pigeons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pigeons')
export class PigeonController {
  private readonly logger = new Logger(PigeonController.name);

  constructor(private readonly pigeonService: PigeonService) {}

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
