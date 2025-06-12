import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { I18nResolver, I18nResolverOptions } from 'nestjs-i18n';
import { Socket } from 'socket.io';

@Injectable()
export class SocketHeaderResolver implements I18nResolver {
  private readonly logger = new Logger(SocketHeaderResolver.name);

  constructor(@I18nResolverOptions() private keys: string[] = []) {
    this.logger.log(`Initialized with keys: ${keys.join(', ')}`);
  }

  resolve(context: ExecutionContext): string | undefined {
    this.logger.debug(`Resolving language from context type: ${context.getType()}`);

    if (context.getType() !== 'ws') {
      this.logger.debug('Context is not WebSocket, returning undefined');
      return undefined;
    }

    const client: Socket = context.switchToWs().getClient();
    const headers = client.handshake?.headers as Record<string, string>;

    if (!headers) {
      this.logger.debug('No headers found in WebSocket handshake');
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
