import { UserLocale } from '@/core/enums';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';
import { Pigeon } from '../entities';
import { PigeonGender, PigeonStatus } from '../enums';

@Injectable()
export class PigeonShareCardService {
  generateHtml(pigeon: Pigeon, children: Pigeon[], locale: UserLocale): string {
    const isAr = locale === UserLocale.ARABIC;
    const dir = isAr ? 'rtl' : 'ltr';
    const L = this.labels(isAr);
    const docNo = this.documentationNo(pigeon);
    const caseNo = (pigeon as Pigeon & { caseNumber?: string }).caseNumber;
    const genderLabel = this.genderLabel(pigeon.gender, isAr);
    const statusLabel = this.statusLabel(pigeon.status, isAr);
    const logoHtml = this.getLogoHtml();

    const rows: Array<{ label: string; value: string }> = [
      { label: L.documentationNo, value: docNo },
      { label: L.ringNo, value: pigeon.ringNo },
      { label: L.ringColor, value: pigeon.ringColor },
      { label: L.gender, value: genderLabel },
      { label: L.status, value: statusLabel },
    ];
    if (caseNo) {
      rows.push({ label: L.caseNumber, value: caseNo });
    }
    rows.push(
      { label: L.father, value: pigeon.fatherName || '—' },
      { label: L.mother, value: pigeon.motherName || '—' },
    );
    if (pigeon.deadAt) {
      rows.push({
        label: L.deadAt,
        value: moment(pigeon.deadAt).format('YYYY/MM/DD'),
      });
    }

    const rowsHtml = rows
      .map(
        (r) => `<div class="row">
  <span class="row-label">${this.escapeHtml(r.label)}</span>
  <span class="row-value">${this.escapeHtml(r.value)}</span>
</div>`,
      )
      .join('');

    const vaccinations = pigeon.vaccinationDates ?? [];
    const vaccHtml =
      vaccinations.length > 0
        ? `<div class="section">
  <div class="section-title">${this.escapeHtml(L.vaccinations)}</div>
  <ul class="vacc-list">
    ${vaccinations
      .map((v) => {
        const d = moment(v.date).format('YYYY/MM/DD');
        const note = v.note ? ` — ${v.note}` : '';
        return `<li>${this.escapeHtml(`${d}: ${v.vaccine}${note}`)}</li>`;
      })
      .join('')}
  </ul>
</div>`
        : '';

    const childrenHtml =
      children.length > 0
        ? `<div class="section">
  <div class="section-title">${this.escapeHtml(L.children)}</div>
  <div class="children">
    ${children
      .map((c) => {
        const cDoc = this.documentationNo(c);
        return `<div class="child-card">
  <div class="child-name">${this.escapeHtml(c.name)}</div>
  <div class="child-meta">${this.escapeHtml(`${L.ringNo}: ${c.ringNo} · ${L.ringColor}: ${c.ringColor}`)}</div>
  <div class="child-meta subtle">${this.escapeHtml(cDoc)}</div>
</div>`;
      })
      .join('')}
  </div>
</div>`
        : '';

    const title = isAr ? `${pigeon.name} — ريشه` : `${pigeon.name} — Risha`;
    const ogDesc = isAr ? `رقم الحجل: ${pigeon.ringNo} · ${docNo}` : `Ring: ${pigeon.ringNo} · ${docNo}`;

    return `<!doctype html>
<html lang="${isAr ? UserLocale.ARABIC : UserLocale.ENGLISH}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.escapeHtml(title)}</title>
  <meta property="og:title" content="${this.escapeHtml(title)}" />
  <meta property="og:description" content="${this.escapeHtml(ogDesc)}" />
  <meta name="description" content="${this.escapeHtml(ogDesc)}" />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Cairo", "Noto Naskh Arabic", Tahoma, sans-serif;
      background: linear-gradient(160deg, #e8f0e8 0%, #d4e4d4 45%, #c5dcc5 100%);
      min-height: 100vh;
      color: #143214;
      direction: ${dir};
      padding: 24px 16px 40px;
      line-height: 1.55;
    }
    .shell {
      max-width: 420px;
      margin: 0 auto;
    }
    .card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(45,106,63,0.12), 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid rgba(45,106,63,0.18);
      overflow: hidden;
    }
    .card-head {
      background: linear-gradient(135deg, #2d6a3f 0%, #1e4a2d 100%);
      color: #f4faf4;
      padding: 22px 20px;
    }
    .card-head-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 14px;
    }
    .card-head-logo {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.4);
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    .card-head-text {
      flex: 1;
      min-width: 0;
      text-align: start;
    }
    .pigeon-name {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 6px;
      word-break: break-word;
      text-align: start;
    }
    .pigeon-sub {
      font-size: 0.9rem;
      opacity: 0.92;
      text-align: start;
    }
    .card-body {
      padding: 18px 18px 22px;
    }
    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding: 11px 0;
      border-bottom: 1px solid #e8ede8;
      font-size: 0.92rem;
    }
    .row:last-of-type {
      border-bottom: none;
    }
    .row-label {
      color: #5a725a;
      font-weight: 600;
      flex: 0 0 40%;
      text-align: start;
    }
    .row-value {
      font-weight: 600;
      color: #1a2e1a;
      flex: 1;
      min-width: 0;
      word-break: break-word;
      text-align: start;
    }
    .section {
      margin-top: 18px;
      padding-top: 6px;
    }
    .section-title {
      font-weight: 700;
      font-size: 0.95rem;
      color: #2d6a3f;
      margin-bottom: 10px;
      text-align: start;
    }
    .vacc-list {
      list-style: none;
      font-size: 0.88rem;
      text-align: start;
    }
    .vacc-list li {
      padding: 6px 0;
      border-bottom: 1px dashed #dde8dd;
    }
    .vacc-list li:last-child {
      border-bottom: none;
    }
    .children {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .child-card {
      background: #f5faf5;
      border-radius: 10px;
      padding: 12px 14px;
      border: 1px solid #dceadc;
      text-align: start;
    }
    .child-name {
      font-weight: 700;
      margin-bottom: 4px;
    }
    .child-meta {
      font-size: 0.85rem;
      color: #3d523d;
    }
    .child-meta.subtle {
      opacity: 0.85;
      font-size: 0.8rem;
      margin-top: 2px;
    }
    .footer-note {
      margin-top: 18px;
      text-align: center;
      font-size: 0.75rem;
      color: #5a6b5a;
    }
    @media print {
      body {
        background: #fff;
        padding: 0;
      }
      .shell { max-width: 100%; }
      .card { box-shadow: none; border: 1px solid #ccc; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="card">
      <div class="card-head">
        <div class="card-head-row">
          <div class="card-head-logo">${logoHtml}</div>
          <div class="card-head-text">
            <div class="pigeon-name">${this.escapeHtml(pigeon.name)}</div>
            <div class="pigeon-sub">${this.escapeHtml(`${L.documentationNo}: ${docNo}`)}</div>
          </div>
        </div>
      </div>
      <div class="card-body">
        ${rowsHtml}
        ${vaccHtml}
        ${childrenHtml}
      </div>
    </div>
    <p class="footer-note">${this.escapeHtml(L.footer)}</p>
  </div>
</body>
</html>`;
  }

  private labels(isAr: boolean) {
    if (isAr) {
      return {
        appName: 'ريشه',
        shareCard: 'بطاقة مشاركة الحمامة',
        documentationNo: 'رقم التوثيق',
        ringNo: 'رقم الحجل',
        ringColor: 'لون الحجل',
        gender: 'الجنس',
        status: 'الحالة',
        caseNumber: 'رقم القضية',
        father: 'الأب',
        mother: 'الأم',
        deadAt: 'تاريخ الوفاة',
        vaccinations: 'التطعيمات',
        children: 'الأبناء',
        footer: 'تمت المشاركة من تطبيق ريشه',
      };
    }
    return {
      appName: 'Risha',
      shareCard: 'Pigeon share card',
      documentationNo: 'Documentation no.',
      ringNo: 'Ring no.',
      ringColor: 'Ring color',
      gender: 'Gender',
      status: 'Status',
      caseNumber: 'Case no.',
      father: 'Father',
      mother: 'Mother',
      deadAt: 'Date of death',
      vaccinations: 'Vaccinations',
      children: 'Offspring',
      footer: 'Shared from the Risha app',
    };
  }

  private documentationNo(pigeon: Pigeon): string {
    return (
      (pigeon as Pigeon & { documentationNo?: string }).documentationNo ??
      `${pigeon.yearOfRegistration}-${(pigeon.letterOfRegistration ?? '').trim().toUpperCase()}`
    );
  }

  private genderLabel(gender: PigeonGender, isAr: boolean): string {
    if (gender === PigeonGender.MALE) return isAr ? 'ذكر' : 'Male';
    if (gender === PigeonGender.FEMALE) return isAr ? 'أنثى' : 'Female';
    return gender;
  }

  private statusLabel(status: PigeonStatus, isAr: boolean): string {
    const map: Record<PigeonStatus, [string, string]> = {
      [PigeonStatus.ALIVE]: ['حي', 'Alive'],
      [PigeonStatus.DEAD]: ['متوفى', 'Dead'],
      [PigeonStatus.SOLD]: ['مباع', 'Sold'],
    };
    const pair = map[status];
    return pair ? (isAr ? pair[0] : pair[1]) : status;
  }

  private escapeHtml(value: string): string {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  private getLogoHtml(): string {
    const logoPath = path.resolve(process.cwd(), 'src/assets/images/logo.jpeg');
    const base64 = fs.readFileSync(logoPath).toString('base64');
    return `<img style="width:100%;height:100%;object-fit:cover;" src="data:image/jpeg;base64,${base64}" alt="Risha" />`;
  }
}
