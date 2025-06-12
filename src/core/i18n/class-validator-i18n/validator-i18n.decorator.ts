import { i18nValidationMessage as i18nValidationMessageCore } from 'nestjs-i18n';
import {
  ValidationOptions,
  IsNumber,
  IsNumberOptions,
  IsString,
  IsInt,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  Length,
  MinLength,
  MaxLength,
  IsPositive,
  IsNegative,
  MinDate,
  MaxDate,
  Min,
  Max,
  IsEmail,
  IsBoolean,
  IsLowercase,
  IsUppercase,
  IsNotEmptyObject,
  ArrayMinSize,
  ArrayMaxSize,
  IsDateString,
  IsObject,
  IsUrl,
  IsIP,
  IsIpVersion,
  IsPhoneNumber,
  IsUUID,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import * as ValidatorJS from 'validator';
import { Logger } from '@nestjs/common';
import { CountryCode } from 'libphonenumber-js/max';
import { Type } from 'class-transformer';
import { I18nTranslations } from '../generated';

const i18nValidationMessage = i18nValidationMessageCore<I18nTranslations>;
const logger = new Logger('ValidationDecorators');

const logValidation = (decorator: string, target: object, key: string, result: boolean) => {
  logger.debug(`${decorator} validation for ${target.constructor.name}.${key}: ${result ? 'Passed' : 'Failed'}`);
};

export const IsNumberI18n = (options?: IsNumberOptions, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsNumber(options, {
      message: i18nValidationMessage('validation.IsNumber'),
      ...validationOptions,
    })(target, key);
    logValidation('IsNumber', target, key, true);
  };
};

export const IsStringI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsString({
      message: i18nValidationMessage('validation.IsString'),
      ...validationOptions,
    })(target, key);
    logValidation('IsString', target, key, true);
  };
};

export const IsIntI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsInt({
      message: i18nValidationMessage('validation.IsInt'),
      ...validationOptions,
    })(target, key);
    logValidation('IsInt', target, key, true);
  };
};

export const IsArrayI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsArray({
      message: i18nValidationMessage('validation.IsArray'),
      ...validationOptions,
    })(target, key);
    logValidation('IsArray', target, key, true);
  };
};

export const IsDateI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsDate({
      message: i18nValidationMessage('validation.IsDate'),
      ...validationOptions,
    })(target, key);
    logValidation('IsDate', target, key, true);
  };
};

export const IsEnumI18n = (entity: object, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsEnum(entity, {
      message: i18nValidationMessage('validation.IsEnum'),
      ...validationOptions,
    })(target, key);
    logValidation('IsEnum', target, key, true);
  };
};

export const ValidateNestedI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    ValidateNested({
      message: i18nValidationMessage('validation.ValidateNested'),
      ...validationOptions,
    })(target, key);
    Type(() => Object)(target, key);
    logValidation('ValidateNested', target, key, true);
  };
};

export const IsDefinedI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsDefined({
      message: i18nValidationMessage('validation.IsDefined'),
      ...validationOptions,
    })(target, key);
    logValidation('IsDefined', target, key, true);
  };
};

export const IsNotEmptyI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsNotEmpty({
      message: i18nValidationMessage('validation.IsNotEmpty'),
      ...validationOptions,
    })(target, key);
    logValidation('IsNotEmpty', target, key, true);
  };
};

export const IsPhoneNumberI18n = (countryCode?: CountryCode, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsPhoneNumber(countryCode, {
      message: i18nValidationMessage('validation.IsPhoneNumber', { country: countryCode || 'any' }),
      ...validationOptions,
    })(target, key);
    logValidation('IsPhoneNumber', target, key, true);
  };
};

export const IsUuidI18n = (version?: '3' | '4' | '5', validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsUUID(version, {
      message: i18nValidationMessage('validation.IsUuid'),
      ...validationOptions,
    })(target, key);
    logValidation('IsUUID', target, key, true);
  };
};

export const LengthI18n = (min: number, max?: number, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    Length(min, max, {
      message: i18nValidationMessage('validation.Length'),
      ...validationOptions,
    })(target, key);
    logValidation('Length', target, key, true);
  };
};

export const MinLengthI18n = (min: number, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    MinLength(min, {
      message: i18nValidationMessage('validation.MinLength'),
      ...validationOptions,
    })(target, key);
    logValidation('MinLength', target, key, true);
  };
};

export const MaxLengthI18n = (max: number, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    MaxLength(max, {
      message: i18nValidationMessage('validation.MaxLength'),
      ...validationOptions,
    })(target, key);
    logValidation('MaxLength', target, key, true);
  };
};

export const IsPositiveI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsPositive({
      message: i18nValidationMessage('validation.IsPositive'),
      ...validationOptions,
    })(target, key);
    logValidation('IsPositive', target, key, true);
  };
};

export const IsNegativeI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsNegative({
      message: i18nValidationMessage('validation.IsNegative'),
      ...validationOptions,
    })(target, key);
    logValidation('IsNegative', target, key, true);
  };
};

export const MinDateI18n = (date: Date, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    MinDate(date, {
      message: i18nValidationMessage('validation.MinDate'),
      ...validationOptions,
    })(target, key);
    logValidation('MinDate', target, key, true);
  };
};

export const MaxDateI18n = (date: Date, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    MaxDate(date, {
      message: i18nValidationMessage('validation.MaxDate'),
      ...validationOptions,
    })(target, key);
    logValidation('MaxDate', target, key, true);
  };
};

export const MinI18n = (min: number, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    Min(min, {
      message: i18nValidationMessage('validation.Min'),
      ...validationOptions,
    })(target, key);
    logValidation('Min', target, key, true);
  };
};

export const MaxI18n = (max: number, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    Max(max, {
      message: i18nValidationMessage('validation.Max'),
      ...validationOptions,
    })(target, key);
    logValidation('Max', target, key, true);
  };
};

export const IsEmailI18n = (options?: ValidatorJS.IsEmailOptions, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsEmail(options, {
      message: i18nValidationMessage('validation.IsEmail'),
      ...validationOptions,
    })(target, key);
    logValidation('IsEmail', target, key, true);
  };
};

export const IsBooleanI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsBoolean({
      message: i18nValidationMessage('validation.IsBoolean'),
      ...validationOptions,
    })(target, key);
    logValidation('IsBoolean', target, key, true);
  };
};

export const IsLowercaseI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsLowercase({
      message: i18nValidationMessage('validation.IsLowercase'),
      ...validationOptions,
    })(target, key);
    logValidation('IsLowercase', target, key, true);
  };
};

export const IsUppercaseI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsUppercase({
      message: i18nValidationMessage('validation.IsUppercase'),
      ...validationOptions,
    })(target, key);
    logValidation('IsUppercase', target, key, true);
  };
};

export const IsNotEmptyObjectI18n = (
  options?: {
    nullable?: boolean;
  },
  validationOptions?: ValidationOptions,
) => {
  return (target: object, key: string) => {
    IsNotEmptyObject(options, {
      message: i18nValidationMessage('validation.IsNotEmptyObject'),
      ...validationOptions,
    })(target, key);
    logValidation('IsNotEmptyObject', target, key, true);
  };
};

export const ArrayMinSizeI18n = (min: number, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    ArrayMinSize(min, {
      message: i18nValidationMessage('validation.ArrayMinSize'),
      ...validationOptions,
    })(target, key);
    logValidation('ArrayMinSize', target, key, true);
  };
};

export const ArrayMaxSizeI18n = (max: number, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    ArrayMaxSize(max, {
      message: i18nValidationMessage('validation.ArrayMaxSize'),
      ...validationOptions,
    })(target, key);
    logValidation('ArrayMaxSize', target, key, true);
  };
};

export const IsDateStringI18n = (options?: ValidatorJS.IsISO8601Options, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsDateString(options, {
      message: i18nValidationMessage('validation.IsDateString'),
      ...validationOptions,
    })(target, key);
    logValidation('IsDateString', target, key, true);
  };
};

export const IsObjectI18n = (validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsObject({
      message: i18nValidationMessage('validation.IsObject'),
      ...validationOptions,
    })(target, key);
    logValidation('IsObject', target, key, true);
  };
};

export const IsUrlI18n = (options?: ValidatorJS.IsURLOptions, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsUrl(options, {
      message: i18nValidationMessage('validation.IsUrl'),
      ...validationOptions,
    })(target, key);
    logValidation('IsUrl', target, key, true);
  };
};

export const IsIPI18n = (version?: IsIpVersion, validationOptions?: ValidationOptions) => {
  return (target: object, key: string) => {
    IsIP(version, {
      message: i18nValidationMessage('validation.IsIp'),
      ...validationOptions,
    })(target, key);
    logValidation('IsIP', target, key, true);
  };
};
