import { Pigeon } from '@/pigeon/entities';
import { PigeonGender, PigeonStatus } from '@/pigeon/enums';
import { IVaccinationRecord } from '@/pigeon/interfaces';
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

/** Rebuild a {@link Pigeon} from Firebase/raw archive payload (ISO date strings, optional nulls). */
export function fromArchiveFirebaseSnapshot(raw: Record<string, unknown>): Pigeon {
  const toDate = (v: unknown): Date | undefined => {
    if (v == null || v === '') return undefined;
    return moment(v as string | number | Date).toDate();
  };

  const vaccinationRaw = raw.vaccinationDates;
  let vaccinationDates: IVaccinationRecord[] | undefined;
  if (Array.isArray(vaccinationRaw)) {
    vaccinationDates = vaccinationRaw.map((r) => {
      const rec = r as { date?: unknown; vaccine?: unknown; note?: unknown };
      return {
        date: toDate(rec.date) ?? moment(0).toDate(),
        vaccine: String(rec.vaccine ?? ''),
        ...(rec.note != null && String(rec.note) !== '' ? { note: String(rec.note) } : {}),
      };
    });
  }

  const pigeon: Pigeon = {
    id: String(raw.id),
    name: String(raw.name ?? ''),
    gender: raw.gender as PigeonGender,
    status: raw.status as PigeonStatus,
    yearOfRegistration: String(raw.yearOfRegistration ?? ''),
    letterOfRegistration: String(raw.letterOfRegistration ?? ''),
    ringNo: String(raw.ringNo ?? ''),
    ringColor: String(raw.ringColor ?? ''),
    fatherName: String(raw.fatherName ?? ''),
    motherName: String(raw.motherName ?? ''),
    createdAt: toDate(raw.createdAt) ?? moment().toDate(),
    updatedAt: toDate(raw.updatedAt) ?? moment().toDate(),
  };

  if (raw.ownerId != null && raw.ownerId !== '') {
    pigeon.ownerId = String(raw.ownerId);
  }
  if (raw.fatherId != null && raw.fatherId !== '') {
    pigeon.fatherId = String(raw.fatherId);
  }
  if (raw.motherId != null && raw.motherId !== '') {
    pigeon.motherId = String(raw.motherId);
  }
  const caseNo = raw.caseNumber;
  if (caseNo != null && caseNo !== '') {
    (pigeon as Pigeon & { caseNumber?: string }).caseNumber = String(caseNo);
  }

  const dead = toDate(raw.deadAt);
  if (dead) {
    pigeon.deadAt = dead;
  }
  if (vaccinationDates?.length) {
    pigeon.vaccinationDates = vaccinationDates;
  }

  return pigeon;
}
