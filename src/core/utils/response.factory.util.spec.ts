import { ErrorCategory } from '../enums';
import { IFieldError, IResponseError } from '../interfaces';
import { ResponseFactory } from './response.factory.util';

describe('ResponseFactory', () => {
  describe('data', () => {
    const data = { name: 'abc' };

    const response = ResponseFactory.data(data);

    expect(response).toEqual({
      data,
    });
  });

  describe('dataArray', () => {
    const data = { name: 'abc' };

    const response = ResponseFactory.dataArray([data]);

    expect(response).toEqual({
      data: [data],
    });
  });

  describe('dataPage', () => {
    const data = { name: 'abc' };
    const meta = { page: 1, size: 10, itemCount: 15 };

    const response = ResponseFactory.dataPage([data], meta);

    expect(response).toEqual({
      data: [data],
      meta: {
        page: 1,
        size: 10,
        itemCount: 15,
        pageCount: 2,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });

  describe('error', () => {
    it('should return an IResponseError object with the correct properties', () => {
      const category: ErrorCategory = ErrorCategory.INTERNAL_SERVER_ERROR;
      const message = 'Server error';
      const errors: IFieldError[] = [
        { field: 'email', message: 'Email is invalid' },
        { field: 'password', message: 'Password is too short' },
      ];

      const response: IResponseError = ResponseFactory.error(category, message, errors);

      expect(response).toMatchObject({
        category,
        message,
        errors,
      });
    });

    it('should return an IResponseError object with an empty errors array if errors is not provided', () => {
      const category: ErrorCategory = ErrorCategory.VALIDATION_ERROR;
      const message = 'Validation error';

      const response: IResponseError = ResponseFactory.error(category, message);

      expect(response).toMatchObject({
        category,
        message,
        errors: [],
      });
    });
  });
});
