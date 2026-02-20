import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataPageResponse, ApiDataResponse } from '@/core/decorators/api';
import { DataPageResponseDto, DataResponseDto, PageOptionsRequestDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { HistoryService } from '@/history/services';
import { UserId } from '@/user/decorators';
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import moment from 'moment';
import { RegisterVaccinatedRequestDto, UpdatePigeonRequestDto } from '../dto/requests';
import { PigeonCountByStatusResponseDto, PigeonResponseDto } from '../dto/responses';
import { PigeonStatus } from '../enums';
import { IVaccinationRecord } from '../interfaces';
import { PigeonService, PigeonStatusService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Pigeon Status')
@Controller('pigeons-status')
export class PigeonStatusController {
  constructor(
    private readonly pigeonStatusService: PigeonStatusService,
    private readonly pigeonService: PigeonService,
    private readonly historyService: HistoryService,
  ) {}

  @Get('alive')
  @ApiOperation({ summary: 'Get all alive pigeons' })
  @ApiDataPageResponse(PigeonResponseDto)
  async findAlivePigeons(
    @Query() pageOptions: PageOptionsRequestDto,
    @UserId() userId: string,
  ): Promise<DataPageResponseDto<PigeonResponseDto>> {
    const pigeons = await this.pigeonStatusService.findAlivePigeons(userId);
    return ResponseFactory.dataPage(
      pigeons.map((pigeon) => new PigeonResponseDto(pigeon)),
      {
        page: pageOptions.page,
        size: pageOptions.size,
        itemCount: pigeons.length,
      },
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of pigeons' })
  @ApiDataResponse('number')
  async count(@UserId() userId: string): Promise<DataResponseDto<number>> {
    const count = await this.pigeonStatusService.count(userId);
    return ResponseFactory.data(count);
  }

  @Get('count/:status')
  @ApiOperation({ summary: 'Get count of pigeons by status' })
  @ApiParam({
    name: 'status',
    description: 'Pigeon status',
    enum: PigeonStatus,
  })
  @ApiDataResponse(PigeonCountByStatusResponseDto)
  async countByStatus(
    @Param('status') status: PigeonStatus,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonCountByStatusResponseDto>> {
    const count = await this.pigeonStatusService.countByStatus(status, userId);
    return ResponseFactory.data(new PigeonCountByStatusResponseDto(count));
  }

  @Patch(':pigeonId')
  @ApiOperation({ summary: 'Update pigeon status' })
  @ApiParam({
    name: 'pigeonId',
    description: 'Pigeon ID',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async updateStatus(
    @Param('pigeonId') pigeonId: string,
    @Body() body: UpdatePigeonRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const pigeon = await this.pigeonService.update(pigeonId, body, userId);
    return ResponseFactory.data(new PigeonResponseDto(pigeon));
  }

  @Post(':pigeonId/vaccinated')
  @ApiOperation({ summary: 'Register pigeon as vaccinated' })
  @ApiParam({
    name: 'pigeonId',
    description: 'Pigeon ID',
    type: String,
  })
  @ApiDataResponse(PigeonResponseDto)
  async registerVaccinated(
    @Param('pigeonId') pigeonId: string,
    @Body() body: RegisterVaccinatedRequestDto,
    @UserId() userId: string,
  ): Promise<DataResponseDto<PigeonResponseDto>> {
    const vaccinationRecord: IVaccinationRecord = {
      date: moment(body.vaccinatedAt).toDate(),
      vaccine: body.vaccineName,
      note: body.note,
    };
    const updatedPigeon = await this.pigeonStatusService.registerVaccinated(pigeonId, vaccinationRecord, userId);
    return ResponseFactory.data(new PigeonResponseDto(updatedPigeon));
  }
}
