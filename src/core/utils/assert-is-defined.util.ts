import { AssertionError } from 'assert';

/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
 */
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new AssertionError({ message: `Expected value to be defined, but received ${val}` });
  }
}
