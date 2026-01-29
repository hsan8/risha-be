import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PigeonService } from '../services';
import { GenerateDocumentationNumberRequestDto } from '../dto/requests';
import { ApiDataResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto } from '@/core/dtos';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '@/user/decorators';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Pigeon Documentation Number')
@Controller('pigeons/documentation-number')
export class PigeonDocumentationNumberController {
  constructor(private readonly pigeonService: PigeonService) {}

  @Get('generate')
  @ApiOperation({ summary: 'Generate a documentation number for a given year' })
  @ApiDataResponse('string')
  async generateDocumentationNo(
    @Query() dto: GenerateDocumentationNumberRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<string>> {
    const documentationNo = await this.pigeonService.generateDocumentationNo(dto.yearOfBirth, userId);
    return ResponseFactory.data(documentationNo);
  }
}
