import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentationNumberService } from '../services';
import { GenerateDocumentationNumberRequestDto } from '../dto/requests';
import { PigeonResponseDto } from '../dto/responses';
import { ApiDataResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto } from '@/core/dtos';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '@/user/decorators';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Pigeon Documentation Number')
@Controller('pigeons-documentation-number')
export class PigeonDocumentationNumberController {
  constructor(private readonly documentationNumberService: DocumentationNumberService) {}

  @Get('/:documentationNo')
  @ApiOperation({ summary: 'Get a pigeon by documentation number' })
  @ApiParam({
    name: 'documentationNo',
    description: 'Pigeon documentation number',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async findByDocumentationNo(
    @Param('documentationNo') documentationNo: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.documentationNumberService.findByDocumentationNo(documentationNo, userId);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }

  @Get('generate')
  @ApiOperation({ summary: 'Generate a documentation number for a given year' })
  @ApiDataResponse('string')
  async generateDocumentationNo(
    @Query() dto: GenerateDocumentationNumberRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<string>> {
    const documentationNo = await this.documentationNumberService.generateDocumentationNo(dto.yearOfBirth, userId);
    return ResponseFactory.data(documentationNo);
  }
}
