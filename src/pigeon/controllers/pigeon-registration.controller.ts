import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PigeonService } from '../services';
import { ApiDataResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto } from '@/core/dtos';

@ApiTags('Pigeon Registration')
@Controller('pigeons/registration')
export class PigeonRegistrationController {
  constructor(private readonly pigeonService: PigeonService) {}

  @Get('generate/:yearOfBirth')
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
}
