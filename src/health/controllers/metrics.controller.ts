import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from '../services/metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    const metrics = await this.metricsService.getMetrics();
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(metrics);
  }
}
