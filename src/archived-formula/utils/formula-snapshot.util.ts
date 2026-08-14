import { Egg } from '@/formula/entities';
import { FormulaStatus } from '@/formula/enums';
import _ from 'lodash';
import moment from 'moment';
import { FormulaSnapshot } from '../entities/formula-snapshot.entity';
import { PigeonSnapshot } from '../entities/pigeon-snapshot.entity';

// ─── Serialise (FormulaSnapshot → Firebase plain object) ────────────────────

export function toFirebaseFormulaSnapshot(snapshot: FormulaSnapshot): Record<string, unknown> {
  const toIso = (d: Date | string | undefined) => (d ? moment(d).toISOString() : null);

  const toPigeonRaw = (p: PigeonSnapshot) => ({
    id: p.id,
    name: p.name,
    ringNo: p.ringNo,
    ringColor: p.ringColor,
    yearOfRegistration: p.yearOfRegistration,
    letterOfRegistration: p.letterOfRegistration,
    gender: p.gender,
    status: p.status,
    ...(p.fatherName != null && { fatherName: p.fatherName }),
    ...(p.motherName != null && { motherName: p.motherName }),
  });

  return {
    id: snapshot.id,
    father: toPigeonRaw(snapshot.father),
    mother: toPigeonRaw(snapshot.mother),
    ...(snapshot.boxNumber != null && { boxNumber: snapshot.boxNumber }),
    eggs: (snapshot.eggs ?? []).map((e) => ({
      id: e.id,
      deliveredAt: toIso(e.deliveredAt),
      transformedToPigeonAt: e.transformedToPigeonAt ? toIso(e.transformedToPigeonAt) : null,
      pigeonId: e.pigeonId ?? null,
    })),
    children: (snapshot.children ?? []).map(toPigeonRaw),
    status: snapshot.status,
    yearOfFormula: snapshot.yearOfFormula,
    ...(snapshot.notes != null && { notes: snapshot.notes }),
    createdAt: toIso(snapshot.createdAt),
    updatedAt: toIso(snapshot.updatedAt),
  };
}

// ─── Deserialise (Firebase plain object → FormulaSnapshot) ──────────────────

function parsePigeonSnapshot(raw: Record<string, unknown>): PigeonSnapshot {
  return {
    id: (raw.id as string) ?? '',
    name: (raw.name as string) ?? '',
    ringNo: (raw.ringNo as string) ?? '',
    ringColor: (raw.ringColor as string) ?? '',
    yearOfRegistration: (raw.yearOfRegistration as string) ?? '',
    letterOfRegistration: (raw.letterOfRegistration as string) ?? '',
    gender: (raw.gender as string) ?? '',
    status: (raw.status as string) ?? '',
    ...(raw.fatherName != null && { fatherName: raw.fatherName as string }),
    ...(raw.motherName != null && { motherName: raw.motherName as string }),
  };
}

/** Handles both the new PigeonSnapshot shape and legacy {id, name} / plain-string shapes. */
function parsePigeonSnapshotLoose(raw: unknown): PigeonSnapshot {
  if (typeof raw === 'string') {
    return { id: raw, name: '', ringNo: '', ringColor: '', yearOfRegistration: '', letterOfRegistration: '', gender: '', status: '' };
  }
  const r = raw as Record<string, unknown>;
  return parsePigeonSnapshot(r);
}

export function fromFirebaseFormulaSnapshot(raw: Record<string, unknown>): FormulaSnapshot {
  const eggsRaw = Array.isArray(raw.eggs) ? raw.eggs : [];
  const eggs: Egg[] = eggsRaw.map((e) => {
    const entry = e as Record<string, unknown>;
    return {
      id: entry.id as string,
      deliveredAt: moment(entry.deliveredAt as string).toDate(),
      ...(entry.transformedToPigeonAt != null && {
        transformedToPigeonAt: moment(entry.transformedToPigeonAt as string).toDate(),
      }),
      ...(entry.pigeonId != null && { pigeonId: entry.pigeonId as string }),
    };
  });

  const childrenRaw = Array.isArray(raw.children) ? raw.children : [];
  const children: PigeonSnapshot[] = childrenRaw.map(parsePigeonSnapshotLoose);

  const fatherRaw = raw.father as Record<string, unknown> | undefined;
  const motherRaw = raw.mother as Record<string, unknown> | undefined;

  return {
    id: raw.id as string,
    father: fatherRaw ? parsePigeonSnapshot(fatherRaw) : { id: '', name: '', ringNo: '', ringColor: '', yearOfRegistration: '', letterOfRegistration: '', gender: '', status: '' },
    mother: motherRaw ? parsePigeonSnapshot(motherRaw) : { id: '', name: '', ringNo: '', ringColor: '', yearOfRegistration: '', letterOfRegistration: '', gender: '', status: '' },
    ...(raw.boxNumber != null && raw.boxNumber !== '' && { boxNumber: String(raw.boxNumber) }),
    eggs,
    children,
    status: raw.status as FormulaStatus,
    yearOfFormula: (raw.yearOfFormula as string) ?? '',
    ...(raw.notes != null && { notes: raw.notes as string }),
    createdAt: moment(raw.createdAt as string).toDate(),
    updatedAt: moment(raw.updatedAt as string).toDate(),
  };
}
