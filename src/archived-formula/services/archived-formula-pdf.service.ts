import { UserLocale } from '@/core/enums';
import { FORMULA_ACTION_LABELS_I18N } from '@/formula-history/constants';
import { FormulaHistoryEvent } from '@/formula-history/entities';
import { FormulaHistoryRepository } from '@/formula-history/repositories';
import { PigeonRepository } from '@/pigeon/repositories';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';
import { ArchivedFormula } from '../entities';
import { ArchivedFormulaReason } from '../enums';

type PigeonMeta = {
  name: string;
  ringNo: string;
  ringColor: string;
};

@Injectable()
export class ArchivedFormulaPdfService {
  constructor(
    private readonly formulaHistoryRepository: FormulaHistoryRepository,
    private readonly pigeonRepository: PigeonRepository,
  ) {}

  async generateAllHtml(archivedFormulas: ArchivedFormula[], locale: UserLocale): Promise<string> {
    const isAr = locale === UserLocale.ARABIC;
    const dir = isAr ? 'rtl' : 'ltr';
    const title = isAr ? 'تقرير التركيبات المؤرشفة - تطبيق ريشه' : 'Archived Formulas Report from Risha App';
    const totalLabel = isAr ? 'عدد التركيبات' : 'Total formulas';
    const generatedLabel = isAr ? 'تم إنشاء التقرير' : 'Generated';
    const appNameLabel = 'تطبيق ريشه';
    const logoHtml = this.getLogoHtml();

    const list = [...archivedFormulas].sort((a, b) => moment(b.archivedAt).valueOf() - moment(a.archivedAt).valueOf());

    const histories = await Promise.all(
      list.map((archived) =>
        this.formulaHistoryRepository.findByFormulaId(archived.userId, archived.originalFormulaId),
      ),
    );

    const allPigeonIds = new Set<string>();
    for (const archived of list) {
      const formula = archived.formulaSnapshot;
      if (formula.father?.id) allPigeonIds.add(formula.father.id);
      if (formula.mother?.id) allPigeonIds.add(formula.mother.id);
      for (const childId of formula.children ?? []) {
        if (childId) allPigeonIds.add(childId);
      }
    }

    const pigeonMap = await this.buildPigeonMetaMap(list[0]?.userId ?? '', allPigeonIds);

    const coverHtml = `
      <div class="report-cover">
        <h1>${this.escapeHtml(title)}</h1>
        <div class="cover-meta">
          <span>${this.escapeHtml(totalLabel)}: <strong>${list.length}</strong></span>
          <span class="cover-dot"></span>
          <span>${this.escapeHtml(generatedLabel)}: <strong>${moment().format('YYYY/MM/DD HH:mm')}</strong></span>
        </div>
      </div>
    `;

    const sections = list
      .map((archived, i) => this.renderFormulaPigeonRowsHtml(archived, histories[i], pigeonMap, locale, isAr))
      .join('');

    return `<!doctype html>
<html lang="${isAr ? UserLocale.ARABIC : UserLocale.ENGLISH}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.escapeHtml(title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4 portrait;
      /* top/bottom margins must be >= fixed header/footer height so content never hides behind them */
      margin: 22mm 14mm 20mm 14mm;
      /* page counter starts at 1 */
      counter-reset: page 1;
    }

    html {
      /* Prevents Chromium from clipping fixed elements to the first page */
      height: auto;
    }

    body {
      font-family: "Cairo", "Noto Naskh Arabic", "Geeza Pro", "Tahoma", Arial, sans-serif;
      /* Base size reduced — everything below scales from this */
      font-size: 11px;
      line-height: 1.55;
      color: #1a2e1a;
      background: #f0f2f0;
      direction: ${dir};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      /* Must NOT have overflow:hidden — that kills fixed positioning on subsequent pages */
      overflow: visible;
    }

    /* ══ Header / Footer ══
     * display:none on screen → display:flex in @media print.
     * position:fixed with explicit top/bottom/left/right repeats on every page
     * as long as the body has overflow:visible and no transform on ancestors.
     */
    .print-footer {
      display: none;
    }
    .print-header { display: none; }

    @media print {
      html, body {
        background: #ffffff;
        /* No overflow clipping */
        overflow: visible;
      }

      .page-shell {
        box-shadow: none !important;
        max-width: 100% !important;
      }

      /* Fixed header — repeats on every printed page */
      .print-header {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 18mm;
        background: #ffffff;
        border-bottom: 1.5px solid #2d6a3f;
        padding: 0 14mm;
        align-items: center;
        /* z-index keeps it above content */
        z-index: 9999;
      }

      /* Push content away from fixed header */
      .content-wrapper {
        padding-top: 18mm !important; /* match header height */
        padding-bottom: 0mm !important;
      }

      .formula-card { box-shadow: none !important; }

      /* Per-page header/footer blocks are not used in the reverted fixed-header/footer layout */
    }

    /* ── Header/Footer inner layout ── */
    .hf-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      flex-direction: ${isAr ? 'row' : 'row-reverse'};
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-direction: ${isAr ? 'row' : 'row-reverse'};
    }

    .logo-circle {
      width: 26px; height: 26px;
      border-radius: 50%;
      border: 1.5px solid #2d6a3f;
      overflow: hidden;
      flex-shrink: 0;
    }

    .logo-circle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

    .brand-name { font-size: 12px; font-weight: 800; color: #2d6a3f; letter-spacing: 0.3px; }
    .hf-title   { font-size: 10px; color: #5a7a5a; font-weight: 500; }

    .page-num { font-size: 10px; color: #6b7280; }

    /* We render page numbers explicitly in HTML (so don't append CSS counter text). */
    .page-num .page-number::after { content: counter(page); }

    /* Per-page header/footer blocks (reliable across HTML->PDF printers) */
    .a4-page {
      position: relative;
      page-break-after: always;
      padding-top: 18mm;
      padding-bottom: 16mm;
    }
    .a4-page:last-child { page-break-after: auto; }

    .page-header,
    .page-footer {
      position: absolute;
      left: 0;
      right: 0;
      background: #ffffff;
      padding: 0 14mm;
      z-index: 9999;
      display: none; /* hide on screen; enable only during print */
      align-items: center;
    }

    .page-header {
      top: 0;
      height: 18mm;
      border-bottom: 1.5px solid #2d6a3f;
    }

    .page-footer {
      bottom: 0;
      height: 16mm;
      border-top: 1px solid #c8dfc8;
    }

    /* ── Page shell (A4 card on screen) ── */
    .page-shell {
      max-width: 210mm;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 4px 32px rgba(0,0,0,0.13);
      min-height: 100vh;
    }

    .content-wrapper { padding: 20px 18px 24px; }

    /* ── Cover ── */
    .report-cover {
      background: linear-gradient(135deg, #1a4d2e 0%, #2d6a3f 55%, #3a8050 100%);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 14px;
      color: #ffffff;
      text-align: start;
    }

    .report-cover h1 { font-size: 15px; font-weight: 800; color: #ffffff; margin-bottom: 5px; }

    .cover-meta {
      font-size: 10px;
      color: rgba(255,255,255,0.80);
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .cover-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.45); flex-shrink: 0; }

    /* ── Formula Card ── */
    .formula-card {
      border: 1px solid #d1e8d1;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 12px;
      page-break-inside: avoid;
      break-inside: avoid;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }

    .formula-card-header {
      background: #f0f8f0;
      border-bottom: 1px solid #d1e8d1;
      padding: 7px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
    }

    .header-main-info { display: flex; flex-direction: column; gap: 1px; }

    .archive-date {
      font-size: 11px;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .date-label { color: #6b7280; font-weight: 400; }
    .date-value { font-weight: 700; color: #1a2e1a; }

    .box-number-row {
      font-size: 10.5px;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .box-label { color: #6b7280; font-weight: 400; }
    .box-value { font-weight: 700; color: #1a2e1a; }

    .reason-badge {
      display: inline-block;
      background: #e6f4ea;
      color: #1a4d2e;
      border: 1px solid #b6dfc0;
      border-radius: 20px;
      padding: 2px 10px;
      font-size: 10px;
      font-weight: 600;
      white-space: nowrap;
    }

    /* ── Father / Mother grid ── */
    .pigeons-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding: 9px 10px 0;
    }

    /* ── Children list ── */
    .children-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
      padding: 6px 10px 0;
      justify-content: ${isAr ? 'flex-start' : 'flex-start'};
    }

    .pigeon-item {
      border: 1px solid #e5ede5;
      border-radius: 6px;
      padding: 7px 10px;
      background: #fafcfa;
      flex: 1 1 calc(50% - 4px); /* 2 cards per row */
      max-width: calc(50% - 4px);
    }

    .pigeon-role-label {
      font-size: 9.5px;
      font-weight: 700;
      color: #2d6a3f;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 5px;
      padding-bottom: 4px;
      border-bottom: 1px solid #d8ead8;
      text-align: start;
    }

    .pigeon-field {
      display: flex;
      align-items: baseline;
      gap: 5px;
      margin: 3px 0;
    }

    .field-label { font-size: 10.5px; color: #6b7280; white-space: nowrap; flex-shrink: 0; }
    .field-value { font-size: 11px; color: #111827; font-weight: 700; flex: 1; text-align: start; }

    /* ── Timeline ── */
    .formula-timeline {
      margin: 8px 10px 10px;
      background: #f4faf4;
      border: 1px solid #d0e8d0;
      border-radius: 6px;
      padding: 7px 10px;
    }

    .timeline-title {
      font-size: 9.5px;
      font-weight: 700;
      color: #2d6a3f;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 4px;
      text-align: start;
    }

    .timeline-entry {
      font-size: 10.5px;
      color: #374151;
      padding: 1px 0;
      display: flex;
      align-items: flex-start;
      gap: 5px;
      text-align: start;
    }

    .timeline-bullet { color: #2d6a3f; font-size: 12px; line-height: 1.3; flex-shrink: 0; }

    .empty-state { text-align: center; padding: 32px 20px; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>

  <!-- Print-only fixed header — repeats on every printed page -->
  <div class="print-header">
    <div class="hf-row">
      <div class="brand">
        <div class="logo-circle">${logoHtml}</div>
        <span class="brand-name">${this.escapeHtml(appNameLabel)}</span>
      </div>
      <div class="hf-title">${this.escapeHtml(title)}</div>
    </div>
  </div>

  <!-- A4 shell (screen only) -->
  <div class="page-shell">
    <div class="content-wrapper">
      ${coverHtml}
      ${
        sections || `<div class="empty-state">${isAr ? 'لا توجد تركيبات مؤرشفة.' : 'No archived formulas found.'}</div>`
      }
    </div>
  </div>

</body>
</html>`;
  }

  private async buildPigeonMetaMap(userId: string, ids: Set<string>): Promise<Map<string, PigeonMeta>> {
    const map = new Map<string, PigeonMeta>();
    if (!userId || ids.size === 0) return map;
    const idList = [...ids];
    const records = await Promise.all(idList.map((id) => this.pigeonRepository.findById(id, userId)));
    for (let i = 0; i < idList.length; i++) {
      const pigeon = records[i];
      if (!pigeon) continue;
      map.set(idList[i], {
        name: pigeon.name ?? '-',
        ringNo: pigeon.ringNo ?? '-',
        ringColor: pigeon.ringColor ?? '-',
      });
    }
    return map;
  }

  private renderFormulaPigeonRowsHtml(
    archived: ArchivedFormula,
    events: FormulaHistoryEvent[],
    pigeonMap: Map<string, PigeonMeta>,
    locale: UserLocale,
    isAr: boolean,
  ): string {
    const formula = archived.formulaSnapshot;
    const archiveDate = moment(archived.archivedAt).format('YYYY/MM/DD');
    const reason = this.translateReason(archived.archiveReason, isAr);
    const boxNumber = formula.boxNumber ?? '-';

    const L = {
      pigeon: isAr ? 'الحمامة' : 'Pigeon',
      ringNo: isAr ? 'رقم الحجل' : 'Ring No.',
      ringColor: isAr ? 'لون الحجل' : 'Ring Color',
      father: isAr ? 'الأب' : 'Father',
      mother: isAr ? 'الأم' : 'Mother',
      child: isAr ? 'فرخ' : 'Chick',
      archivedOn: isAr ? 'تاريخ الأرشفة' : 'Archived on',
      box: isAr ? 'رقم الخانة' : 'Box No.',
      history: isAr ? 'السجل' : 'History',
    };

    // Timeline — once per card
    const sortedEvents = [...events].sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
    const timelineHtml =
      sortedEvents.length > 0
        ? `<div class="formula-timeline">
          <div class="timeline-title">${this.escapeHtml(L.history)}</div>
          ${sortedEvents
            .map(
              (ev) =>
                `<div class="timeline-entry">
              <span class="timeline-bullet">•</span>
              <span>${this.escapeHtml(
                `${this.getEventLabel(ev, locale)} — ${moment(ev.date).format('YYYY/MM/DD')}`,
              )}</span>
            </div>`,
            )
            .join('')}
        </div>`
        : '';

    // Pigeon card: name, ring no, ring color only
    const makePigeonItem = (id: string | undefined, fallback: string | undefined, role: string): string => {
      const meta = id ? pigeonMap.get(id) : undefined;
      const name = meta?.name ?? fallback ?? '-';
      const ringNo = meta?.ringNo ?? '-';
      const ringColor = meta?.ringColor ?? '-';
      return `<div class="pigeon-item">
  <div class="pigeon-role-label">${this.escapeHtml(role)}</div>
  <div class="pigeon-field">
    <span class="field-label">${this.escapeHtml(L.pigeon)}:</span>
    <span class="field-value">${this.escapeHtml(name)}</span>
  </div>
  <div class="pigeon-field">
    <span class="field-label">${this.escapeHtml(L.ringNo)}:</span>
    <span class="field-value">${this.escapeHtml(ringNo)}</span>
  </div>
  <div class="pigeon-field">
    <span class="field-label">${this.escapeHtml(L.ringColor)}:</span>
    <span class="field-value">${this.escapeHtml(ringColor)}</span>
  </div>
</div>`;
    };

    const sons = formula.children ?? [];
    const pigeonCards = [
      makePigeonItem(formula.father?.id, formula.father?.name, L.father),
      makePigeonItem(formula.mother?.id, formula.mother?.name, L.mother),
      ...(sons?.map((childId, idx) => makePigeonItem(childId, pigeonMap.get(childId)?.name, `${L.child} ${idx + 1}`)) ??
        []),
    ];
    const pigeonsHtml = `<div class="children-list">${pigeonCards.join('')}</div>`;

    return `<section class="formula-card">
  <div class="formula-card-header">
    <div class="header-main-info">
      <div class="archive-date">
        <span class="date-label">${this.escapeHtml(L.archivedOn)}:</span>
        <span class="date-value">${this.escapeHtml(archiveDate)}</span>
      </div>
      <div class="box-number-row">
        <span class="box-label">${this.escapeHtml(L.box)}:</span>
        <span class="box-value">${this.escapeHtml(boxNumber)}</span>
      </div>
    </div>
    <span class="reason-badge">${this.escapeHtml(reason)}</span>
  </div>
  ${pigeonsHtml}
  ${timelineHtml}
</section>`;
  }

  private getEventLabel(event: FormulaHistoryEvent, locale: UserLocale): string {
    const labels = FORMULA_ACTION_LABELS_I18N[event.action];
    if (!labels) return event.action;
    const label = labels[locale] ?? labels[UserLocale.ARABIC];
    if (typeof label === 'function' && event.params?.previousBoxNumber != null && event.params?.newBoxNumber != null) {
      return label(event.params.previousBoxNumber, event.params.newBoxNumber);
    }
    return typeof label === 'string' ? label : event.action;
  }

  private translateReason(reason: string, isAr: boolean): string {
    const map: Record<ArchivedFormulaReason, Record<UserLocale, string>> = {
      EGGS_DESTROYED: { [UserLocale.ARABIC]: 'إتلاف البيض', [UserLocale.ENGLISH]: 'Eggs destroyed' },
      ARCHIVED_BY_USER: { [UserLocale.ARABIC]: 'أرشفة يدوية', [UserLocale.ENGLISH]: 'Archived by user' },
      ALL_CHICKS_REGISTERED: {
        [UserLocale.ARABIC]: 'تسجيل جميع الأفراخ',
        [UserLocale.ENGLISH]: 'All chicks registered',
      },
    };
    return map[reason]?.[isAr ? UserLocale.ARABIC : UserLocale.ENGLISH] ?? reason;
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
    return `<img style="width:100%;height:100%;object-fit:cover;border-radius:50%;" src="data:image/jpeg;base64,${base64}" alt="risha logo" />`;
  }
}
