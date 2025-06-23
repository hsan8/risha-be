import { ValidationError } from '@nestjs/common';
import { IFieldError } from '../interfaces';
import { formatClassValidatorErrors } from './class-validator-formatter.util';

describe('formatClassValidatorErrors', () => {
  test('should return empty array when given empty array', () => {
    expect(formatClassValidatorErrors([])).toEqual([]);
  });

  test('should format single error object correctly', () => {
    const errors: ValidationError = {
      property: 'username',
      constraints: {
        isNotEmpty: 'Username should not be empty',
      },
    };

    const expectedOutput: IFieldError[] = [
      {
        field: 'username',
        message: 'Username should not be empty',
      },
    ];

    expect(formatClassValidatorErrors(errors)).toEqual(expectedOutput);
  });

  test('should format multiple error objects correctly', () => {
    const errors: ValidationError[] = [
      {
        property: 'username',
        constraints: {
          isNotEmpty: 'Username should not be empty',
        },
        // no children list
      },
      {
        property: 'password',
        constraints: {
          isNotEmpty: 'Password should not be empty',
        },
        children: [], // empty children list
      },
    ];

    const expectedOutput: IFieldError[] = [
      {
        field: 'username',
        message: 'Username should not be empty',
      },
      {
        field: 'password',
        message: 'Password should not be empty',
      },
    ];

    expect(formatClassValidatorErrors(errors)).toEqual(expectedOutput);
  });

  test('should format nested error objects correctly', () => {
    const errors: ValidationError[] = [
      {
        property: 'username',
        constraints: {
          isNotEmpty: 'Username should not be empty',
        },
      },
      {
        property: 'address',
        constraints: {},
        children: [
          {
            property: 'city',
            constraints: {
              isNotEmpty: 'City should not be empty',
            },
          },
          {
            property: 'street',
            constraints: {
              isNotEmpty: 'Street should not be empty',
            },
          },
        ],
      },
    ];

    const expectedOutput: IFieldError[] = [
      {
        field: 'username',
        message: 'Username should not be empty',
      },
      {
        field: 'address.city',
        message: 'City should not be empty',
      },
      {
        field: 'address.street',
        message: 'Street should not be empty',
      },
    ];

    expect(formatClassValidatorErrors(errors)).toEqual(expectedOutput);
  });

  test('should format error object without constraints', () => {
    const errors: ValidationError[] = [
      {
        property: 'username',
      },
    ];

    const expectedOutput: IFieldError[] = [
      {
        field: 'username',
        message: '',
      },
    ];

    expect(formatClassValidatorErrors(errors)).toEqual(expectedOutput);
  });
});
