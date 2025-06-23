import { ErrorCategory } from '../enums';

export interface IFieldError {
  field: string;
  message: string;
}

export interface IResponseError {
  category: ErrorCategory;
  message: string;
  errors?: IFieldError[];
}
