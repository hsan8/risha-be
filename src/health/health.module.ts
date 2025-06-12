import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HealthController } from './controllers';
import { MetricsService } from './services/metrics.service';

@Module({
  imports: [TerminusModule, HttpModule, PrometheusModule],
  controllers: [HealthController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class HealthModule {}
