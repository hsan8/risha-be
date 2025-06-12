import { HttpServiceModule } from '@app/global/http-service/http-service.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TrxGatewayService } from './services/trx-gateway.service';

@Module({
  imports: [HttpServiceModule, HttpModule],
  providers: [TrxGatewayService],
  exports: [TrxGatewayService],
})
export class TrxEpModule {}
