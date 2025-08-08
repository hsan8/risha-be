import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Validates that the string is a valid Firebase ID
 * Firebase IDs are alphanumeric strings that start with - or a letter, followed by
 * alphanumeric characters, underscores, or hyphens
 */
export function IsFirebaseId(validationOptions?: ValidationOptions) {
  return function firebaseIdValidator(object: object, propertyName: string) {
    registerDecorator({
      name: 'isFirebaseId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // Firebase ID pattern: starts with - or letter, followed by alphanumeric, _, or -
          // Length should be reasonable (Firebase generates IDs around 20 characters)
          const firebaseIdPattern = /^-?[a-zA-Z][a-zA-Z0-9_-]*$/;
          const MIN_FIREBASE_ID_LENGTH = 3;
          const MAX_FIREBASE_ID_LENGTH = 50;
          return (
            firebaseIdPattern.test(value) &&
            value.length >= MIN_FIREBASE_ID_LENGTH &&
            value.length <= MAX_FIREBASE_ID_LENGTH
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Firebase ID`;
        },
      },
    });
  };
}
