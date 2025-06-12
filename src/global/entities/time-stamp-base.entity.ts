import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Base class for Time stampes like created_at and updated_at , deleted_at
 * @abstract
 * just extend this class for each entity that will have the following properties
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} deletedAt
 */
export abstract class TimeStampBaseEntity {
  // create at
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
  // update at
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // delete at (soft delete)
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
