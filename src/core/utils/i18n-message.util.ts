import { I18nContext } from 'nestjs-i18n';

export class I18nMessage {
  static translate(key: string, args?: Record<string, any>): string {
    const i18n = I18nContext.current();
    if (!i18n) {
      throw new Error('I18nContext is not available');
    }
    return i18n.t(`app.${key}`, { args });
  }

  static error(key: string, args?: Record<string, any>): string {
    return this.translate(`pigeon.error.${key}`, args);
  }

  static success(key: string, args?: Record<string, any>): string {
    return this.translate(`pigeon.success.${key}`, args);
  }
}
