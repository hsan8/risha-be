import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { UserId } from '@/user/decorators';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PigeonResponseDto } from '../dto/responses';
import { DocumentationNumberService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Pigeon Registration')
@Controller('pigeons-documentation-number')
export class PigeonDocumentationNumberController {
  constructor(private readonly documentationNumberService: DocumentationNumberService) {}

  @Get()
  @ApiOperation({ summary: 'Get a pigeon by year of registration and letter of registration' })
  @ApiQuery({ name: 'yearOfRegistration', example: '2026-2025', description: 'Year of registration (e.g. 2026-2025)' })
  @ApiQuery({ name: 'letterOfRegistration', example: 'A', description: 'Letter of registration' })
  @ApiDataResponse(PigeonResponseDto)
  async findByYearOfRegistrationAndLetter(
    @Query('yearOfRegistration') yearOfRegistration: string,
    @Query('letterOfRegistration') letterOfRegistration: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.documentationNumberService.findByYearOfRegistrationAndLetter(
      yearOfRegistration,
      letterOfRegistration,
      userId,
    );
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }
}
