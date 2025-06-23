import { I18nContext } from 'nestjs-i18n';

/**
 * Wrap the `i18n.t` to
 * - Avoid errors when the i18n context is not available (e.g. in JSON parsing errors).
 * - Try to find the localized value in the `general` namespace if available.
 * - Return the key if no localized value is found in any namespace as a fallback.
 */
export class I18nContextWrapper {
  constructor(private readonly i18nCtx?: I18nContext) {}

  t(key: string): string {
    if (!this.i18nCtx || typeof key !== 'string') {
      return key;
    }

    // Trying to find the localized value in the supported namespaces
    const namespaces = ['app', 'general'];
    for (const namespace of namespaces) {
      const namespacedKey = `${namespace}.${key}`;
      const localizedMsg: string = this.i18nCtx.t(namespacedKey);

      if (namespacedKey !== localizedMsg) {
        return localizedMsg;
      }
    }

    // If the key has a localized value in the given namespace
    // Or no localized value found, return the same key as a fallback
    return this.i18nCtx.t(key);
  }

  /**
   * Return the first message that can found from the passed list of keys.
   * Think of it as or `||` operation for localization, `i18n(key1) || i18n(key2)`, but the value is truthy if it has a
   * localization.
   *
   * `ts('KEY_1', 'KEY_2')`:
   * - `'KEY_1' = 'msg1', 'KEY_2' has no localization`, the return value is `msg1`.
   * - `'KEY_1' = 'msg1', 'KEY_2' = 'msg2'`, the return value is `msg1`.
   * - `'KEY_2' = 'msg2', 'KEY_1' has no localization`, the return value is `msg2`.
   * - `'KEY_1' and 'KEY_2' have no localization`, the return value is `KEY_2`.
   */
  ts(...keys: string[]): string {
    let last = '';

    for (const key of keys) {
      const localizedMsg = this.t(key);
      if (localizedMsg !== key) return localizedMsg; // found a localization, return early
      last = localizedMsg;
    }

    return last;
  }
}
