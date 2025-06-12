import { IsNotEmptyI18n, IsStringI18n } from '../i18n';

export class MultiLanguageDto {
  @IsStringI18n()
  @IsNotEmptyI18n()
  en: string;

  @IsStringI18n()
  @IsNotEmptyI18n()
  ar: string;
}
