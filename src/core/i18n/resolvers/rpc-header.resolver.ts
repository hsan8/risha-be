import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { I18nResolver, I18nResolverOptions } from 'nestjs-i18n';

@Injectable()
export class RabbitMQHeaderResolver implements I18nResolver {
  private readonly logger = new Logger(RabbitMQHeaderResolver.name);

  constructor(@I18nResolverOptions() private keys: string[] = []) {
    this.logger.log(`Initialized with keys: ${keys.join(', ')}`);
  }

  resolve(context: ExecutionContext): string | undefined {
    this.logger.debug(`Resolving language from context type: ${context.getType()}`);

    if (context.getType() !== 'rpc') {
      this.logger.debug('Context is not RPC, returning undefined');
      return undefined;
    }

    const rmqContext: RmqContext = context.switchToRpc().getContext();
    const headers = rmqContext?.getMessage()?.properties?.headers;

    if (!headers) {
      this.logger.debug('No headers found in RMQ context');
      return undefined;
    }

    this.logger.debug(`Headers found: ${JSON.stringify(headers)}`);

    const result = this.keys.reduce((acc: string | undefined, key: string) => {
      if (acc !== undefined) {
        return acc;
      }
      const value = headers[key];
      this.logger.debug(`Checking key "${key}": ${value}`);
      return value !== undefined && value !== null ? value : undefined;
    }, undefined);

    this.logger.debug(`Resolved language: ${result}`);
    return result;
  }
}
