import { ValidationError } from '@nestjs/common';
import { IFieldError } from '../interfaces';

export function formatClassValidatorErrors(errors: ValidationError[] | ValidationError): IFieldError[] {
  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  return errors.map((err: ValidationError) => format(err, '')).flat();
}

function format(error: ValidationError, parentProperty: string): IFieldError[] {
  const property = propertyPath(parentProperty, error.property);
  const constraints = Object.values(error.constraints || ['']);

  const formattedErrors: IFieldError[] = constraints.map((constraintMessage) => ({
    field: property,
    message: constraintMessage,
  }));

  if (error.children?.length) {
    const childErrors = error.children.map((err) => format(err, property)).flat();
    formattedErrors.push(...childErrors);
  }

  return formattedErrors;
}

function propertyPath(parentProperty: string, currentProperty: string) {
  return parentProperty ? `${parentProperty}.${currentProperty}` : currentProperty;
}
