import { Pigeon } from '@/pigeon/entities';
import _ from 'lodash';
import moment from 'moment';

export function toFirebaseSnapshot(pigeon: Pigeon): Record<string, unknown> {
  const toIso = (d: Date | string | undefined) => (d ? moment(d).toISOString() : null);
  return {
    ..._.omit(pigeon, ['father', 'mother']),
    createdAt: toIso(pigeon.createdAt),
    updatedAt: toIso(pigeon.updatedAt),
    deadAt: toIso(pigeon.deadAt),
    vaccinationDates:
      pigeon.vaccinationDates?.map((r) => ({ date: toIso(r.date), vaccine: r.vaccine, note: r.note ?? null })) ?? null,
    ownerId: pigeon.ownerId ?? null,
  };
}
