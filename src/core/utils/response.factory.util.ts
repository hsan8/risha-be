import { DataArrayResponseDto, DataPageResponseDto, DataResponseDto, IPageMeta, PageMetaResponseDto } from '../dtos';
import { ErrorCategory } from '../enums';
import { IFieldError, IResponseError } from '../interfaces';

export class ResponseFactory {
  static data<T>(data: T): DataResponseDto<T> {
    return new DataResponseDto(data);
  }

  static dataArray<T>(data: T[]): DataArrayResponseDto<T> {
    return new DataArrayResponseDto(data);
  }

  static dataPage<T>(data: T[], meta: IPageMeta): DataPageResponseDto<T> {
    return new DataPageResponseDto(data, new PageMetaResponseDto(meta));
  }

  static error(category: ErrorCategory, message: string, errors?: IFieldError[]): IResponseError {
    return {
      category,
      message,
      errors: errors || [],
    };
  }
}
