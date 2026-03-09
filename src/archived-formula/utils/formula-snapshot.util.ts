import { Formula } from '@/formula/entities';
import _ from 'lodash';
import moment from 'moment';

export function toFirebaseFormulaSnapshot(formula: Formula): Record<string, unknown> {
  const toIso = (d: Date | string | undefined) => (d ? moment(d).toISOString() : null);
  return {
    ..._.omit(formula, ['father', 'mother']),
    father: formula.father,
    mother: formula.mother,
    eggs: (formula.eggs ?? []).map((e) => ({
      id: e.id,
      deliveredAt: toIso(e.deliveredAt),
      transformedToPigeonAt: e.transformedToPigeonAt ? toIso(e.transformedToPigeonAt) : null,
      pigeonId: e.pigeonId ?? null,
    })),
    children: formula.children ?? [],
    createdAt: toIso(formula.createdAt),
    updatedAt: toIso(formula.updatedAt),
  };
}
