import { Expose } from 'class-transformer';

export class TrxGatewayResponse {
  @Expose({ name: 'redirectUrl' })
  redirectUrl!: string;
}
