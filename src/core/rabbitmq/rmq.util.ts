import { ClientRMQ, RmqRecordBuilder } from '@nestjs/microservices';
import { catchException } from './utils';

export type THeaders = Record<string, any>;
export function sendMessagePipeException<T>({
  client,
  pattern,
  data,
  headers,
}: {
  client: ClientRMQ;
  pattern: any;
  data?: T;
  headers?: THeaders;
}) {
  const record = new RmqRecordBuilder()
    .setData(data ?? {})
    .setOptions({
      headers,
    })
    .build();
  return client.send(pattern, record).pipe(catchException());
}
