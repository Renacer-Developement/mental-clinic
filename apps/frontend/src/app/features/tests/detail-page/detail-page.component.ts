import {CommonModule, isPlatformBrowser, NgFor, NgIf} from '@angular/common';
import { ImportsModule } from '../../../shared/primeng-imports.module';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SeoService } from '../../../core/seo/seo.service';
import { TestService } from '../services/test.service';
import { Test } from '../models/test.model';
import { specializedTests } from '../constants/specialized-test-types.enum';
import { clinicContacts } from '../../shared/constants/contacts.constants';
import { ClinicContactsService } from '../../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { GoogleAnalyticsService } from '../../../analytics/google-analytics.service';
import { TEST_ROUTES } from "../../../shared/constants/routes.constants";
import { NotFoundComponent } from '../../not-found/not-found.component';
import { DivaQuizComponent, DivaResult } from '../components/diva-quiz/diva-quiz.component';

@Component({
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, ImportsModule, RouterLink, NotFoundComponent, DivaQuizComponent],
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly testService = inject(TestService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly contactsService = inject(ClinicContactsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  data!: Test;
  loadError = false;

  answers: { [key: string]: number } = {};

  currentQuestionIndex = 0;
  showError = false;
  isTestCompleted = false;

  totalScore = 0;
  resultMessage = '';
  resultDescription = '';

  schemaScores: { [key: string]: number } = {};
  highestSchema = '';

  // HADS
  hadsAnxietyScore = 0;
  hadsDepressionScore = 0;
  hadsAnxietyResult = '';
  hadsDepressionResult = '';

  // RBQ
  rbqSpectraScores: { [key: string]: number } = {};
  rbqTotalScore = 0;

  // ASRS
  asrsPartAPositive = 0;
  asrsPartANegative = 0;
  asrsPartBPositive = 0;
  asrsPartBNegative = 0;
  asrsResult = '';

  // DIVA-5
  divaResult: DivaResult | null = null;

  protected readonly Object = Object;
  protected readonly specializedTests = specializedTests;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.route.params
        .pipe(
            switchMap(params => this.testService.getTestById(params['id'])),
            takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: response => {
            this.data = response;
            this.updateSEO(response.name, response.description);
            this.cdr.detectChanges();
          },
          error: () => {
            this.loadError = true;
            this.cdr.detectChanges();
          },
        });
  }

  nextQuestion(): void {
    const currentQuestion = this.data.questions[this.currentQuestionIndex];

    if (this.answers[currentQuestion._id] === undefined) {
      this.showError = true;
      return;
    }

    this.showError = false;

    if (this.currentQuestionIndex === this.data.questions.length - 1) {
      this.submitAnswers();
    } else {
      this.currentQuestionIndex++;
    }
  }

  submitAnswers(): void {
    if (!this.data) return;

    // reset common result fields
    this.resultMessage = '';
    this.resultDescription = '';

    // =============================
    // HADS
    // =============================
    if (this.data.specialTest === specializedTests.HADS) {
      this.hadsAnxietyScore = 0;
      this.hadsDepressionScore = 0;

      this.data.questions.forEach((question, index) => {
        const questionId = question._id;

        if (this.answers[questionId] !== undefined) {
          if (index <= 7) {
            this.hadsAnxietyScore += Number(this.answers[questionId]);
          } else {
            this.hadsDepressionScore += Number(this.answers[questionId]);
          }
        }
      });

      const anxietyInterpretation = this.data.resultInterpretation
          .filter(i => i.type === 'anxiety')
          .find(i =>
              this.hadsAnxietyScore >= i.range[0] &&
              (i.range[1] === null || this.hadsAnxietyScore <= i.range[1])
          );

      const depressionInterpretation = this.data.resultInterpretation
          .filter(i => i.type === 'depression')
          .find(i =>
              this.hadsDepressionScore >= i.range[0] &&
              (i.range[1] === null || this.hadsDepressionScore <= i.range[1])
          );

      this.hadsAnxietyResult = anxietyInterpretation?.result || 'Невизначено';
      this.hadsDepressionResult = depressionInterpretation?.result || 'Невизначено';
    }

        // =============================
        // RBQ-2A
    // =============================
    else if (this.data.specialTest === specializedTests.RBQ2A) {
      this.rbqSpectraScores = {};
      this.rbqTotalScore = 0;

      this.data.factor?.forEach(s => {
        let sum = 0;

        s.questions.forEach(qNumber => {
          const idx = qNumber - 1;
          const question = this.data.questions[idx];

          if (question) {
            const value = this.answers[question._id];

            if (value !== undefined) {
              sum += Number(value);
            }
          }
        });

        this.rbqSpectraScores[s.name] = sum;
        this.rbqTotalScore += sum;
      });

      const keys = Object.keys(this.rbqSpectraScores);

      if (keys.length) {
        this.highestSchema = keys.reduce((a, b) =>
            this.rbqSpectraScores[a] > this.rbqSpectraScores[b] ? a : b
        );
      }
    }

        // =============================
        // ASRS ADHD
    // =============================
    else if (this.data.specialTest === specializedTests.ASRS) {
      /**
       * Thresholds for ASRS questions.
       * Part A = first 6 questions
       * Part B = remaining 12 questions
       *
       * Positive symptom if answer >= threshold.
       */
      const thresholds = [
        2, 2, 2, 2, 3, 3,
        1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4
      ];

      this.asrsPartAPositive = 0;
      this.asrsPartANegative = 0;
      this.asrsPartBPositive = 0;
      this.asrsPartBNegative = 0;

      this.data.questions.forEach((question, index) => {
        const answer = this.answers[question._id];

        if (answer === undefined) {
          return;
        }

        const threshold = thresholds[index] ?? Number.MAX_SAFE_INTEGER;
        const isPositive = Number(answer) >= threshold;

        // Part A: questions 1-6
        if (index < 6) {
          if (isPositive) {
            this.asrsPartAPositive++;
          } else {
            this.asrsPartANegative++;
          }
        }
        // Part B: questions 7-18
        else {
          if (isPositive) {
            this.asrsPartBPositive++;
          } else {
            this.asrsPartBNegative++;
          }
        }
      });

      const interpretation = this.data.resultInterpretation.find(
          ({ range: [min, max] }) =>
              this.asrsPartAPositive >= min &&
              (max === null || this.asrsPartAPositive <= max)
      );

      this.asrsResult = interpretation?.result || 'Невизначено';
    }

        // =============================
        // SMI
    // =============================
    else if (this.data.specialTest === specializedTests.SMI) {
      this.schemaScores = {};

      this.data.resultInterpretation.forEach(({ name, questionIndex }) => {
        let total = 0;
        let count = 0;

        questionIndex.forEach(index => {
          const qId = this.data.questions[index - 1]?._id;

          if (qId && this.answers[qId] !== undefined) {
            total += Number(this.answers[qId]);
            count++;
          }
        });

        if (count > 0) {
          this.schemaScores[name] = total / count;
        }
      });

      this.highestSchema = Object.keys(this.schemaScores).reduce((a, b) =>
          this.schemaScores[a] > this.schemaScores[b] ? a : b
      );
    }

        // =============================
        // GENERAL TEST
    // =============================
    else {
      this.totalScore = Object.keys(this.answers)
          .map(key => this.answers[key])
          .reduce((sum, v) => sum + Number(v), 0);

      const interpretation = this.data.resultInterpretation.find(
          ({ range: [min, max] }) =>
              this.totalScore >= min &&
              (max === null || this.totalScore <= max)
      );

      this.resultMessage = interpretation?.result || 'Не вдалося визначити рівень.';
      this.resultDescription = interpretation['description'] || '';
    }

    this.isTestCompleted = true;
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }

  onDivaCompleted(result: DivaResult): void {
    this.divaResult = result;
    this.isTestCompleted = true;
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }

  yesNo(value: boolean): string {
    return value ? 'Так' : 'Ні';
  }

  collateralLabel(value: number | undefined): string {
    return value === 1 ? 'Так' : value === 0 ? 'Ні' : 'Н/д';
  }

  get asrsTotalPositive(): number {
    return this.asrsPartAPositive + this.asrsPartBPositive;
  }

  get asrsTotalNegative(): number {
    return this.asrsPartANegative + this.asrsPartBNegative;
  }

  async generatePDF(): Promise<void> {
    // Loaded on demand — jsPDF + html2canvas are only needed for this export,
    // not for the initial page render, so keep them out of the main bundle.
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    const ORG  = 'Онлайн центр ментального здоров\'я Євгена Скрипника';
    const date = new Date().toLocaleDateString('uk-UA');
    const filename = `${this.data.name} — Результати.pdf`;
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Fetch logo as base64 so html2canvas can render it without path issues
    const logoBase64 = await fetch('/assets/logo.avif')
      .then(r => r.blob())
      .then(b => new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result as string);
        reader.readAsDataURL(b);
      }));

    const offscreen = (html: string, width: number) => {
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;top:0;left:-9999px;width:${width}px;background:#fff;`;
      d.innerHTML = html;
      document.body.appendChild(d);
      return d;
    };

    // ── Header element (navy bar with logo + Cyrillic text) ───────────────────
    const hdrEl = offscreen(`
      <div style="background:#003168;color:#fff;padding:8px 22px;
                  display:flex;justify-content:space-between;align-items:center;
                  font-family:Arial,sans-serif;font-size:11px;font-weight:600;
                  box-sizing:border-box;width:750px">
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${logoBase64}" style="height:30px;width:auto;display:block;border-radius:50%" />
          <span>${ORG}</span>
        </div>
        <span style="opacity:.7">${date}</span>
      </div>`, 750);

    // ── Content element ───────────────────────────────────────────────────────
    const cntEl = offscreen(this.buildPrintContent(), 750);

    try {
      const [hdrCanvas, cntCanvas] = await Promise.all([
        html2canvas(hdrEl.firstElementChild as HTMLElement, { scale: 2, useCORS: true, logging: false }),
        html2canvas(cntEl,  { scale: 2, useCORS: true, logging: false }),
      ]);

      const doc  = new jsPDF({ unit: 'pt', format: 'a4' });
      const PW   = doc.internal.pageSize.getWidth();
      const PH   = doc.internal.pageSize.getHeight();
      const ML   = 30;
      const MB   = 24;
      const cntW = PW - ML * 2;

      // Header rendered height in pt
      const HDR = (hdrCanvas.height / hdrCanvas.width) * cntW + 4;

      const cw         = cntCanvas.width;
      const ch         = cntCanvas.height;
      const ratio      = cntW / cw;
      const pxPerPage  = Math.floor((PH - HDR - MB) / ratio);
      const pages      = Math.ceil(ch / pxPerPage);

      const hdrData = hdrCanvas.toDataURL('image/jpeg', 0.95);

      for (let p = 0; p < pages; p++) {
        if (p > 0) doc.addPage();

        // Stamp header image (browser-rendered → correct Cyrillic)
        doc.addImage(hdrData, 'JPEG', 0, 0, PW, (hdrCanvas.height / hdrCanvas.width) * PW);

        // Content slice
        const sy    = Math.round(p * pxPerPage);
        const sh    = Math.round(Math.min(pxPerPage, ch - sy));
        const slice = document.createElement('canvas');
        slice.width  = cw;
        slice.height = sh;
        slice.getContext('2d')!.drawImage(cntCanvas, 0, sy, cw, sh, 0, 0, cw, sh);
        doc.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', ML, HDR, cntW, sh * ratio);
      }

      const blob = doc.output('blob');

      if (isIOS) {
        // Use the Web Share API — triggers the native iOS share sheet
        // ("Save to Files", AirDrop, Mail, …). This is the only reliable way
        // to get a real download prompt on iOS Safari; the `download` attribute
        // is silently ignored and blob-URL links just open inline.
        const file = new File([blob], filename, { type: 'application/pdf' });
        if (navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: filename });
          } catch (err: any) {
            if (err?.name !== 'AbortError') throw err;
            // AbortError = user dismissed the sheet, nothing to do
          }
        } else {
          // Fallback for very old iOS (<15): open PDF inline so the user can
          // long-press → "Download Linked File" or use the share button manually
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } finally {
      document.body.removeChild(hdrEl);
      document.body.removeChild(cntEl);
    }
  }

  private getAnswerLabel(question: any): string {
    const val = this.answers[question._id];
    if (val === undefined) return '—';
    const idx = (question.value as number[]).indexOf(Number(val));
    return idx >= 0 ? question.labelText[idx] : String(val);
  }

  private buildPrintContent(): string {
    const date = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });

    if (this.data.specialTest === this.specializedTests.DIVA && this.divaResult) {
      return this.buildDivaPrintContent(date, this.divaResult);
    }

    const answersRows = this.data.questions.map((q, i) => `
      <tr style="background:${i % 2 === 1 ? '#fafafa' : '#fff'}">
        <td style="width:28px;color:#9aa0b2;font-weight:700;padding:6px 10px;border-bottom:1px solid #f0f0f0">${i + 1}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;font-size:10pt;vertical-align:top">${q.question}</td>
        <td style="width:200px;font-weight:600;color:#3d4663;padding:6px 10px;border-bottom:1px solid #f0f0f0">${this.getAnswerLabel(q)}</td>
      </tr>`).join('');

    let resultsHtml = '';
    if (this.data.specialTest === this.specializedTests.RBQ2A) {
      resultsHtml = `<p style="margin-bottom:8px"><strong>Загальна сума балів: ${this.rbqTotalScore}</strong></p>
        <table style="width:100%;border-collapse:collapse">
          ${Object.keys(this.rbqSpectraScores).map(k => `
          <tr><td style="padding:5px 10px;border-bottom:1px solid #f0f0f0">${k}</td>
              <td style="width:80px;font-weight:800;color:#5f75d6;text-align:right;padding:5px 10px;border-bottom:1px solid #f0f0f0">${this.rbqSpectraScores[k]}</td></tr>`).join('')}
        </table>`;
    } else if (this.data.specialTest === this.specializedTests.SMI) {
      resultsHtml = `<table style="width:100%;border-collapse:collapse">
          ${Object.keys(this.schemaScores).map(k => `
          <tr><td style="padding:5px 10px;border-bottom:1px solid #f0f0f0">${k}</td>
              <td style="width:80px;font-weight:800;color:#5f75d6;text-align:right;padding:5px 10px;border-bottom:1px solid #f0f0f0">${this.schemaScores[k].toFixed(2)}</td></tr>`).join('')}
        </table>`;
    } else if (this.data.specialTest === this.specializedTests.HADS) {
      resultsHtml = `
        <p style="margin-bottom:6px"><strong>Тривожність:</strong> ${this.hadsAnxietyScore} — ${this.hadsAnxietyResult}</p>
        <p><strong>Депресія:</strong> ${this.hadsDepressionScore} — ${this.hadsDepressionResult}</p>`;
    } else if (this.data.specialTest === this.specializedTests.ASRS) {
      resultsHtml = `
        <p style="margin-bottom:5px"><strong>Частина A — позитивні:</strong> ${this.asrsPartAPositive}/6</p>
        <p style="margin-bottom:5px"><strong>Частина A — негативні:</strong> ${this.asrsPartANegative}/6</p>
        <p style="margin-bottom:5px"><strong>Частина B — позитивні:</strong> ${this.asrsPartBPositive}/12</p>
        <p style="margin-bottom:5px"><strong>Частина B — негативні:</strong> ${this.asrsPartBNegative}/12</p>
        <p><strong>Інтерпретація:</strong> ${this.asrsResult}</p>`;
    } else {
      resultsHtml = `
        <p style="margin-bottom:6px"><strong>Сума балів:</strong> ${this.totalScore}</p>
        <p style="margin-bottom:6px"><strong>Результат:</strong> ${this.resultMessage}</p>
        ${this.resultDescription ? `<p style="margin-bottom:6px">${this.resultDescription}</p>` : ''}
        ${this.data.commonMessage ? `<p style="margin-top:8px;font-size:9.5pt;color:#718096">${this.data.commonMessage}</p>` : ''}`;
    }

    return `
<div style="font-family:Arial,sans-serif;font-size:11pt;color:#1a1a2e;padding:20px 24px;background:#fff">
  <h1 style="font-size:15pt;color:#003168;margin:0 0 4px">${this.data.name}</h1>
  <p style="font-size:9pt;color:#718096;margin:0 0 20px">Дата: ${date} · ${this.data.duration} · ${this.data.questions.length} питань</p>

  <h2 style="font-size:9.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#5f75d6;border-bottom:1px solid #e2e8f0;padding-bottom:5px;margin:0 0 10px">Відповіді</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
    <thead>
      <tr style="background:#f2f3f3">
        <th style="font-size:9pt;font-weight:700;text-align:left;padding:7px 10px;color:#003168">#</th>
        <th style="font-size:9pt;font-weight:700;text-align:left;padding:7px 10px;color:#003168">Питання</th>
        <th style="font-size:9pt;font-weight:700;text-align:left;padding:7px 10px;color:#003168">Відповідь</th>
      </tr>
    </thead>
    <tbody>${answersRows}</tbody>
  </table>

  <h2 style="font-size:9.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#5f75d6;border-bottom:1px solid #e2e8f0;padding-bottom:5px;margin:0 0 10px">Результати</h2>
  <div style="background:#f2f3f3;border-left:4px solid #5f75d6;padding:12px 16px;border-radius:0 8px 8px 0;line-height:1.6">
    ${resultsHtml}
  </div>

  <p style="margin-top:24px;padding:9px 14px;background:#fffbeb;border:1px solid #f6ad55;border-radius:6px;font-size:9pt;color:#744210">
    Результати тесту не є медичним діагнозом. Зверніться до лікаря-психіатра для отримання професійної консультації.
  </p>
</div>`;
  }

  private buildDivaPrintContent(date: string, r: DivaResult): string {
    const cell = 'padding:7px 10px;border-bottom:1px solid #f0f0f0';
    const head = 'font-size:9pt;font-weight:700;text-align:left;padding:7px 10px;color:#003168';
    const row = (label: string, value: boolean) =>
      `<p style="margin:0 0 5px">${label}: <strong>${this.yesNo(value)}</strong></p>`;

    return `
<div style="font-family:Arial,sans-serif;font-size:11pt;color:#1a1a2e;padding:20px 24px;background:#fff">
  <h1 style="font-size:15pt;color:#003168;margin:0 0 4px">${this.data.name}</h1>
  <p style="font-size:9pt;color:#718096;margin:0 0 20px">Дата: ${date}</p>

  <h2 style="font-size:9.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#5f75d6;border-bottom:1px solid #e2e8f0;padding-bottom:5px;margin:0 0 10px">Формуляр підрахунку</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
    <thead><tr style="background:#f2f3f3"><th style="${head}">Область</th><th style="${head}">Зрілість</th><th style="${head}">Дитинство</th></tr></thead>
    <tbody>
      <tr><td style="${cell}">Дефіцит уваги (A1)</td><td style="${cell}">${r.a1Adult} / 9</td><td style="${cell}">${r.a1Child} / 9</td></tr>
      <tr><td style="${cell}">Гіперактивність / імпульсивність (A2)</td><td style="${cell}">${r.a2Adult} / 9</td><td style="${cell}">${r.a2Child} / 9</td></tr>
    </tbody>
  </table>

  <div style="background:#f2f3f3;border-left:4px solid #5f75d6;padding:12px 16px;border-radius:0 8px 8px 0;line-height:1.6">
    <p style="margin:0 0 5px">Доповнення A — більше, ніж в однолітків (зрілість): <strong>A1 ${this.yesNo(r.suppA1Adult)} · A2 ${this.yesNo(r.suppA2Adult)}</strong></p>
    <p style="margin:0 0 5px">Доповнення A — більше, ніж в однолітків (дитинство): <strong>A1 ${this.yesNo(r.suppA1Child)} · A2 ${this.yesNo(r.suppA2Child)}</strong></p>
    ${row('Критерій A, зрілість: ≥5 в одній області', r.adultThreshold)}
    ${row('Критерій A, дитинство: ≥6 в одній області', r.childThreshold)}
    ${row(`Критерій B — симптоми до 12 років${r.onsetAge ? ` (з ${r.onsetAge} р.)` : ''}`, r.onset)}
    ${row('Критерій C/D — порушення ≥2 сфер (зрілість)', r.impairAdult)}
    ${row('Критерій C/D — порушення ≥2 сфер (дитинство)', r.impairChild)}
    ${row(`Критерій E — не пояснюється іншим розладом${r.otherDisorder ? ` (${r.otherDisorder})` : ''}`, r.notOther)}
    ${r.collateral.map(c => `<p style="margin:0 0 5px">Додаткова інформація — ${c.label}: <strong>${this.collateralLabel(c.value)}</strong></p>`).join('')}
    <p style="margin:10px 0 4px">Діагноз СДУГ (клінічна орієнтація, не автодіагноз): <strong>${r.met ? 'критерії зібрані' : 'критерії не зібрані повністю'}</strong></p>
    <p style="margin:0">Форма прояву: <strong>${r.form}</strong></p>
  </div>

  <p style="margin-top:24px;padding:9px 14px;background:#fffbeb;border:1px solid #f6ad55;border-radius:6px;font-size:9pt;color:#744210">
    Результати не є медичним діагнозом. Остаточний висновок робить лікар-психіатр.
  </p>
</div>`;
  }

  openPdf(pdfLink: string | null | undefined): void {
    if (!pdfLink || pdfLink === 'null') {
      return;
    }

    window.open(pdfLink, '_blank');
  }

  clearError(): void {
    this.showError = false;
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  selectAnswer(questionId: string, value: number): void {
    this.answers[questionId] = value;
    this.showError = false;
  }

  restartTest(): void {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.isTestCompleted = false;

    this.totalScore = 0;
    this.resultMessage = '';
    this.resultDescription = '';

    this.schemaScores = {};
    this.highestSchema = '';

    this.rbqSpectraScores = {};
    this.rbqTotalScore = 0;

    this.hadsAnxietyScore = 0;
    this.hadsDepressionScore = 0;
    this.hadsAnxietyResult = '';
    this.hadsDepressionResult = '';

    this.asrsPartAPositive = 0;
    this.asrsPartANegative = 0;
    this.asrsPartBPositive = 0;
    this.asrsPartBNegative = 0;
    this.asrsResult = '';

    this.divaResult = null;
  }

  goToAllTests(): void {
    this.router.navigate([TEST_ROUTES.LIST]);
  }

  openContacts(): void {
    this.contactsService.openDialog(clinicContacts);
  }

  updateSEO(name: string, description: string): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const canonical = `/test/detail/${id}`;
    const BASE_URL = 'https://doctor-skripnik.com.ua';

    this.seo.updatePage({
      title: `${name} | Центр ментального здоров'я Євгена Скрипника`,
      description,
      canonical,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name,
        url: `${BASE_URL}${canonical}`,
        description,
        inLanguage: 'uk',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Психологічні тести', item: `${BASE_URL}/test` },
            { '@type': 'ListItem', position: 3, name: name, item: `${BASE_URL}${canonical}` },
          ],
        },
      },
    });
  }
}