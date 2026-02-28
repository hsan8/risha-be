import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse, ApiDataResponse } from '@/core/decorators/api';
import { DataArrayResponseDto, DataResponseDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateNewsItemRequestDto, UpdateNewsItemRequestDto } from '../dto/requests';
import { NewsItemResponseDto } from '../dto/responses';
import { NewsService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a news item' })
  @ApiDataResponse(NewsItemResponseDto)
  async create(
    @Body() dto: CreateNewsItemRequestDto,
  ): Promise<DataResponseDto<NewsItemResponseDto>> {
    const item = await this.newsService.create(dto);
    return ResponseFactory.data(new NewsItemResponseDto(item));
  }

  @Get()
  @ApiOperation({ summary: 'Get all news items' })
  @ApiDataArrayResponse(NewsItemResponseDto)
  async findAll(): Promise<DataArrayResponseDto<NewsItemResponseDto>> {
    const items = await this.newsService.findAll();
    return ResponseFactory.dataArray(items.map((i) => new NewsItemResponseDto(i)));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a news item by ID' })
  @ApiParam({ name: 'id', description: 'News item UUID', type: String })
  @ApiDataResponse(NewsItemResponseDto)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DataResponseDto<NewsItemResponseDto>> {
    const item = await this.newsService.findById(id);
    return ResponseFactory.data(new NewsItemResponseDto(item));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a news item' })
  @ApiParam({ name: 'id', description: 'News item UUID', type: String })
  @ApiDataResponse(NewsItemResponseDto)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNewsItemRequestDto,
  ): Promise<DataResponseDto<NewsItemResponseDto>> {
    const item = await this.newsService.update(id, dto);
    return ResponseFactory.data(new NewsItemResponseDto(item));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a news item' })
  @ApiParam({ name: 'id', description: 'News item UUID', type: String })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.newsService.remove(id);
  }
}
