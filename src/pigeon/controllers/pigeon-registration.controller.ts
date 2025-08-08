import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PigeonService } from '../services';
import { ApiDataResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto } from '@/core/dtos';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '@/user/decorators';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  async generateRegistrationNumber(
    @Param('yearOfBirth') yearOfBirth: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<string>> {
    const registrationNumber = await this.pigeonService.generateRegistrationNumber(yearOfBirth, userId);
    return ResponseFactory.data(registrationNumber);
  }
}
