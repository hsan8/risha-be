import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import moment from 'moment';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      timestamp: moment().toISOString(),
      service: 'risha-api',
      version: '1.0.0',
    };
  }

  @Get('details')
  checkHealthDetails() {
    return {
      status: 'ok',
      timestamp: moment().toISOString(),
      service: 'risha-api',
      version: '1.0.0',
      checks: {
        database: 'up',
        api: 'up',
      },
    };
  }
}
