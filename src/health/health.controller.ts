import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'risha-api',
      version: '1.0.0',
    };
  }

  @Get('details')
  checkHealthDetails() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'risha-api',
      version: '1.0.0',
      checks: {
        database: 'up',
        api: 'up',
      },
    };
  }
}
