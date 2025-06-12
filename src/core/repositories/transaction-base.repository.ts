import { Request } from 'express';
import { EntityManager, Repository } from 'typeorm';
import { DataSource } from 'typeorm/data-source/DataSource';
import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';

/**
 * Base repository for transactional operations
 * This class should be used for all repositories that need to be transactional
 * All repositories that need to be transactional should extend this class
 * ! important! all repositories that inherit from this class should have @Injectable({ scope: Scope.REQUEST }) decorator
 * @param {DataSource} dataSource  typeorm data source
 * @param {Request} request , express request object
 */
export class TransactionBaseRepository {
  constructor(
    private dataSource: DataSource,
    private request: Request,
  ) {}

  protected getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}
