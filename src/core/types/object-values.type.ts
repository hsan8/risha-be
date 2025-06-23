/**
 * Converts an object's values to a union type.
 * Should be used in conjunction with constant objects to define enums.
 *
 * @example
 * const Status = { SUCCEEDED: 'Success', FAILED: 'Failure' } as const;
 * type Status = ObjectValues<typeof Status>; // 'Success' | 'Failure'
 * const foo: Status = Status.SUCCEEDED;
 * const bar: Status = 'Failure';
 *
 * @see https://youtu.be/jjMbPt_H3RQ
 */
export type ObjectValues<T> = T[keyof T];
