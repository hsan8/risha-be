import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionInterceptor.name);

  constructor(private dataSource: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    // get request object
    const req = context.switchToHttp().getRequest<Request>();
    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // attach query manager with transaction to the request
    req[ENTITY_MANAGER_KEY] = queryRunner.manager;
    // log
    this.logger.log(`Transaction started for ${context.getClass().name} `);
    return next.handle().pipe(
      // concatMap gets called when route handler completes successfully
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        this.logger.log(`Transaction committed for ${context.getClass().name}`);
        return data;
      }),
      // catchError gets called when route handler throws an exception
      catchError(async (e) => {
        this.logger.log(`Transaction rolled back for ${context.getClass().name}`);
        await queryRunner.rollbackTransaction();
        throw e;
      }),
      // always executed, even if catchError method throws an exception
      finalize(async () => {
        this.logger.log(`Transaction released for ${context.getClass().name}`);
        await queryRunner.release();
      }),
    );
  }
}
