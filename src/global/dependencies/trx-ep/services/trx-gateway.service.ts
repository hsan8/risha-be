import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TrxGatewayResponse, TrxPaymentRequest } from '../interfaces';

const PAYMENT_ENDPOINT = 'Payment-core-ep/process-payment';

@Injectable()
export class TrxGatewayService {
  private readonly BASE_URL: string;
  private logger = new Logger(TrxGatewayResponse.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.BASE_URL = this.configService.getOrThrow('TRANSACTION_GATEWAY_BASE_URL');
  }

  async generatePaymentLink(data: TrxPaymentRequest): Promise<string> {
    this.logger.log(`Generating payment link for Transaction gateway: /${PAYMENT_ENDPOINT}`);

    try {
      const result = await firstValueFrom(
        this.httpService.post<TrxGatewayResponse>(`${this.BASE_URL}/${PAYMENT_ENDPOINT}`, data),
      );

      // TODO: handle the availbility of the knet gateway proprly
      if (!result.data) {
        this.logger.error('No response data received from Transaction gateway');
        throw new InternalServerErrorException('somthing failed');
      }

      const paymentUrl = result.data.redirectUrl;

      if (!paymentUrl) {
        this.logger.error('Payment URL not found in response');
        throw new InternalServerErrorException('somthing failed');
      }

      return paymentUrl;
    } catch (error) {
      this.logger.error(`Error generating payment link: ${error}`);
      throw new InternalServerErrorException('somthing failed');
    }
  }
}
