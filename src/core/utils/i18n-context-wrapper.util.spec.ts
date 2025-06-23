import { createMock } from '@golevelup/ts-jest';
import { I18nContext } from 'nestjs-i18n';
import { I18nContextWrapper } from './i18n-context-wrapper.util';

describe('I18nContextWrapper', () => {
  let i18nCtxWrapper: I18nContextWrapper;
  let tMock: jest.Mock;
  const localizedMsgMock = 'Localized test message';

  beforeEach(() => {
    tMock = jest.fn();
    const i18nCtxMock = createMock<I18nContext>({ t: tMock });
    i18nCtxWrapper = new I18nContextWrapper(i18nCtxMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('t', () => {
    it('should return the key if i18nCtx is not defined', () => {
      i18nCtxWrapper = new I18nContextWrapper();

      const result = i18nCtxWrapper.t('test');

      expect(result).toBe('test');
      expect(tMock).not.toHaveBeenCalled();
    });

    it('should return the key if key is not string', () => {
      i18nCtxWrapper = new I18nContextWrapper();

      const result = i18nCtxWrapper.t(null as any);

      expect(result).toBe(null);
      expect(tMock).not.toHaveBeenCalled();
    });

    it('should try to find the localized message in the app namespace if available', () => {
      tMock.mockReturnValueOnce(localizedMsgMock);

      const result = i18nCtxWrapper.t('test');

      expect(result).toBe(localizedMsgMock);
      expect(tMock).toHaveBeenNthCalledWith(1, 'app.test');
    });

    it('should try to find the localized message in the general namespace no available in app', () => {
      tMock.mockReturnValueOnce('app.test');
      tMock.mockReturnValueOnce(localizedMsgMock);

      const result = i18nCtxWrapper.t('test');

      expect(result).toBe(localizedMsgMock);
      expect(tMock).toHaveBeenNthCalledWith(1, 'app.test');
      expect(tMock).toHaveBeenNthCalledWith(2, 'general.test');
    });

    it('should return the key if no localized value is found in any namespace', () => {
      tMock.mockReturnValueOnce('app.test');
      tMock.mockReturnValueOnce('general.test');
      tMock.mockReturnValueOnce('test');

      const result = i18nCtxWrapper.t('test');

      expect(result).toBe('test');
      expect(tMock).toHaveBeenNthCalledWith(1, 'app.test');
      expect(tMock).toHaveBeenNthCalledWith(2, 'general.test');
    });
  });

  describe('ts', () => {
    it('"KEY_1" = "msg1", "KEY_2" has no localization, the return value is "msg1"', () => {
      tMock.mockReturnValueOnce('localized_key_1');

      const result = i18nCtxWrapper.ts('key_1', 'key_2');

      expect(result).toBe('localized_key_1');
    });

    it('"KEY_1" = "msg1", "KEY_2" = "msg2", the return value is "msg1"', () => {
      tMock.mockReturnValueOnce('localized_key_1');
      tMock.mockReturnValueOnce('localized_key_2');

      const result = i18nCtxWrapper.ts('key_1', 'key_2');

      expect(result).toBe('localized_key_1');
    });

    it('"KEY_2" = "msg2", "KEY_1" has no localization, the return value is "msg2"', () => {
      tMock.mockReturnValueOnce('key_1');
      tMock.mockReturnValueOnce('localized_key_2');

      const result = i18nCtxWrapper.ts('key_1', 'key_2');

      expect(result).toBe('localized_key_2');
    });

    it('"KEY_1" and "KEY_2" have no localization, the return value is "KEY_2"', () => {
      tMock.mockReturnValueOnce('key_1');
      tMock.mockReturnValueOnce('key_2');

      const result = i18nCtxWrapper.ts('key_1', 'key_2');

      expect(result).toBe('key_2');
    });
  });
});
