/** Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) to Western (0-9). Treats ١٢٣ and 123 as the same for ring number. */
const ARABIC_INDIC_TO_WESTERN: Record<string, string> = {
  '\u0660': '0',
  '\u0661': '1',
  '\u0662': '2',
  '\u0663': '3',
  '\u0664': '4',
  '\u0665': '5',
  '\u0666': '6',
  '\u0667': '7',
  '\u0668': '8',
  '\u0669': '9',
};

/**
 * Normalizes a ring number so that Arabic-Indic numerals (١٢٣) are equivalent to Western (123).
 * Use when storing or comparing ring numbers.
 */
export function normalizeRingNo(ringNo: string | null | undefined): string {
  if (ringNo == null) return '';
  let out = '';
  for (const char of String(ringNo)) {
    out += ARABIC_INDIC_TO_WESTERN[char] ?? char;
  }
  return out;
}
