const OBJECTIONABLE_PATTERN =
  /\b(fuck|shit|bitch|asshole)\b|كس أم|شرموطة|قحبة|ابن الكلب/i;

export function hasObjectionableContent(text: string): boolean {
  return OBJECTIONABLE_PATTERN.test(text ?? '');
}
