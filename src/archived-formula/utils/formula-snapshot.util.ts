import { Egg, Formula, Parent } from '@/formula/entities';
import { FormulaStatus } from '@/formula/enums';
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

export function fromFirebaseFormulaSnapshot(raw: Record<string, unknown>): Formula {
  const father = raw.father as Parent | undefined;
  const mother = raw.mother as Parent | undefined;
  const eggsRaw = Array.isArray(raw.eggs) ? raw.eggs : [];
  const eggs: Egg[] = eggsRaw.map((e) => {
    const entry = e as Record<string, unknown>;
    return {
      id: entry.id as string,
      deliveredAt: moment(entry.deliveredAt).toDate(),
      ...(entry.transformedToPigeonAt != null && {
        transformedToPigeonAt: moment(entry.transformedToPigeonAt).toDate(),
      }),
      ...(entry.pigeonId != null && { pigeonId: entry.pigeonId as string }),
    };
  });

  return {
    id: raw.id as string,
    father: father ?? { name: '' },
    mother: mother ?? { name: '' },
    ...(raw.boxNumber != null && raw.boxNumber !== '' && { boxNumber: String(raw.boxNumber) }),
    eggs,
    children: Array.isArray(raw.children) ? (raw.children as string[]) : [],
    status: raw.status as FormulaStatus,
    yearOfFormula: (raw.yearOfFormula as string) ?? '',
    createdAt: moment(raw.createdAt).toDate(),
    updatedAt: moment(raw.updatedAt).toDate(),
  };
}
