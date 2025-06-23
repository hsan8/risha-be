export function isTrue(value: any) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase().trim() === 'true';
  }

  return false;
}
