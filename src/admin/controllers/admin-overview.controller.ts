import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataResponse } from '@/core/decorators/api';
import { DataResponseDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import { AdminGuard } from '@/admin/guards';
import { AdminOverviewResponseDto } from '@/admin/dto/responses';
import { AdminOverviewService } from '@/admin/services';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/overview')
export class AdminOverviewController {
  constructor(private readonly adminOverviewService: AdminOverviewService) {}

  @Get()
  @ApiOperation({ summary: 'Global counts for dashboard (admin)' })
  @ApiDataResponse(AdminOverviewResponseDto, HttpStatus.OK)
  async getOverview(): Promise<DataResponseDto<AdminOverviewResponseDto>> {
    const metrics = await this.adminOverviewService.getOverviewMetrics();
    return ResponseFactory.data(new AdminOverviewResponseDto(metrics));
  }
}
