import { AssertionError } from 'assert';
import { assertIsDefined } from './assert-is-defined.util';

describe('assertIsDefined', () => {
  it('should not throw any errors if value is defined', () => {
    const act = () => assertIsDefined('abc');

    expect(act).not.toThrow();
  });

  it('should not throw an assertion error if value is undefined', () => {
    const act = () => assertIsDefined(undefined);

    expect(act).toThrowError(new AssertionError({ message: `Expected value to be defined, but received undefined` }));
  });

  it('should not throw an assertion error if value is null', () => {
    const act = () => assertIsDefined(null);

    expect(act).toThrowError(new AssertionError({ message: `Expected value to be defined, but received null` }));
  });
});
