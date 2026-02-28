import { IVaccinationRecord } from '@/pigeon/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Pigeon } from '../../entities/pigeon.entity';
import { PigeonGender, PigeonStatus } from '../../enums/pigeon.enum';

class VaccinationRecordDto {
  @ApiProperty({ example: '2024-12-01T10:30:00Z' })
  date!: Date;

  @ApiProperty({ example: 'Newcastle' })
  vaccine!: string;

  @ApiProperty({ example: 'First dose' })
  note?: string;

  constructor(vaccinationRecord: IVaccinationRecord) {
    this.date = vaccinationRecord.date;
    this.vaccine = vaccinationRecord.vaccine;
    this.note = vaccinationRecord.note;
  }
}

export class PigeonResponseDto {
  @ApiProperty({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07' })
  id: string;

  @ApiProperty({ example: 'Blue Thunder' })
  name: string;

  @ApiProperty({ enum: PigeonGender, example: PigeonGender.MALE })
  gender: PigeonGender;

  @ApiProperty({ enum: PigeonStatus, example: PigeonStatus.ALIVE })
  status: PigeonStatus;

  @ApiProperty({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07', nullable: true })
  ownerId: string | null;

  @ApiProperty({ example: '2026-2025' })
  yearOfRegistration: string;

  @ApiProperty({ example: 'A' })
  letterOfRegistration: string;

  /** Computed for API convenience: yearOfRegistration + letter (e.g. 2026-2025-A) */
  @ApiProperty({ example: '2026-2025-A' })
  documentationNo: string;

  @ApiProperty({ example: 'NL-2024-1234567' })
  ringNo: string;

  @ApiProperty({ example: 'Blue' })
  ringColor: string;

  @ApiProperty({ example: 'CASE-2024-001', nullable: true })
  caseNumber: string | null;

  @ApiProperty({ example: 'Red Champion' })
  fatherName: string;

  @ApiProperty({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07', nullable: true })
  fatherId: string | null;

  @ApiProperty({ example: 'Silver Star' })
  motherName: string;

  @ApiProperty({ example: 'BED2423E-F36B-1410-8DF1-0022B5E2BA07', nullable: true })
  motherId: string | null;

  @ApiProperty({ example: [{ date: '2024-12-01T10:30:00Z', vaccine: 'Newcastle', note: 'First dose' }] })
  @Type(() => VaccinationRecordDto)
  vaccination: VaccinationRecordDto[];

  @ApiProperty({ example: '2024-12-01T10:30:00Z', nullable: true })
  deadAt: Date | null;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  createdAt: Date;

  @ApiProperty({ example: new Date('2023-10-01T10:30:00Z') })
  updatedAt: Date;

  constructor(pigeon: Pigeon) {
    this.id = pigeon.id;
    this.name = pigeon.name;
    this.gender = pigeon.gender;
    this.status = pigeon.status;
    this.ownerId = pigeon.ownerId;
    this.yearOfRegistration = pigeon.yearOfRegistration;
    this.letterOfRegistration = pigeon.letterOfRegistration;
    this.documentationNo =
      (pigeon as Pigeon & { documentationNo?: string }).documentationNo ??
      `${pigeon.yearOfRegistration}-${(pigeon.letterOfRegistration ?? '').trim().toUpperCase()}`;
    this.ringNo = pigeon.ringNo;
    this.ringColor = pigeon.ringColor;
    this.fatherName = pigeon.fatherName;
    this.fatherId = pigeon.fatherId ?? null;
    this.motherName = pigeon.motherName;
    this.motherId = pigeon.motherId ?? null;
    this.deadAt = pigeon.deadAt;
    this.vaccination =
      pigeon.vaccinationDates?.map(
        (vaccinationRecord: IVaccinationRecord) => new VaccinationRecordDto(vaccinationRecord),
      ) ?? [];
    this.createdAt = pigeon.createdAt;
    this.updatedAt = pigeon.updatedAt;
  }
}
