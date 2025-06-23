import { isTrue } from './is-true.util';

describe('isTrue', () => {
  it('should return true if value is true', () => {
    expect(isTrue(true)).toBe(true);
  });

  it('should return true if value is "true"', () => {
    expect(isTrue('true')).toBe(true);
    expect(isTrue(' tRuE  ')).toBe(true); // with whitespace
  });

  it('should return false if value is false', () => {
    expect(isTrue(false)).toBe(false);
  });

  it('should return false if value is "false"', () => {
    expect(isTrue('false')).toBe(false);
    expect(isTrue(' fAlSe  ')).toBe(false); // with whitespace
  });

  it('should return false if value is not boolean or string', () => {
    expect(isTrue(1)).toBe(false);
    expect(isTrue(null)).toBe(false);
    expect(isTrue(undefined)).toBe(false);
    expect(isTrue({})).toBe(false);
    expect(isTrue([])).toBe(false);
  });
});
