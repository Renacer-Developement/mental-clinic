import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import Quill from 'quill';
import { environment } from '../../../../environments/environment';
import { ArticleService } from '../../../core/services/article.service';
import { ArticleDto } from '../../../core/models/article.model';
import { TestService } from '../../../core/services/test.service';
import { TestListItem } from '../../../core/models/test.model';

// ── Register custom blots ONCE (before any Quill instance) ───────────────────

(() => {
  try {
    const BlockEmbed = (Quill as any).import('blots/block/embed');
    class YtPlayerBlot extends BlockEmbed {
      static blotName  = 'yt-player';
      static tagName   = 'div';
      static className = 'yt-player';
      static create(videoId: string): HTMLElement {
        const node = super.create() as HTMLElement;
        node.setAttribute('data-video-id', videoId);
        node.setAttribute('contenteditable', 'false');
        return node;
      }
      static value(node: HTMLElement): string {
        return node.getAttribute('data-video-id') ?? '';
      }
    }
    (Quill as any).register({ 'formats/yt-player': YtPlayerBlot }, true);
  } catch { /* safe to ignore */ }
})();

(() => {
  try {
    const BlockEmbed = (Quill as any).import('blots/block/embed');
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    class ImportantBlockBlot extends BlockEmbed {
      static blotName  = 'important-block';
      static tagName   = 'div';
      static className = 'important-block';
      static create(text: string): HTMLElement {
        const node = super.create() as HTMLElement;
        node.setAttribute('data-text', text);
        node.setAttribute('contenteditable', 'false');
        node.innerHTML = `<p class="important-block__text">${esc(text)}</p><button class="important-block__edit" type="button" title="Редагувати"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>`;
        return node;
      }
      static value(node: HTMLElement): string {
        return node.getAttribute('data-text') || '';
      }
    }
    (Quill as any).register({ 'formats/important-block': ImportantBlockBlot }, true);
  } catch { /* safe to ignore */ }
})();

(() => {
  try {
    const BlockEmbed = (Quill as any).import('blots/block/embed');
    const esc = (s: string) => s.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    class SocialPostBlot extends BlockEmbed {
      static blotName  = 'social-post';
      static tagName   = 'div';
      static className = 'social-post';
      static create(v: { image: string; fb?: string; inst?: string; desc?: string }): HTMLElement {
        const node = super.create() as HTMLElement;
        if (v.image) node.setAttribute('data-image', v.image);
        if (v.fb)    node.setAttribute('data-fb', v.fb);
        if (v.inst)  node.setAttribute('data-inst', v.inst);
        if (v.desc)  node.setAttribute('data-desc', v.desc);
        node.setAttribute('contenteditable', 'false');
        let links = '';
        if (v.fb)
          links += `<a href="${esc(v.fb)}" target="_blank" rel="noopener" class="social-post__link social-post__link--fb"><svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>Допис у Фейсбук</a>`;
        if (v.inst)
          links += `<a href="${esc(v.inst)}" target="_blank" rel="noopener" class="social-post__link social-post__link--inst"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>Пост в Instagram</a>`;
        node.innerHTML = `<div class="social-post__row"><img class="social-post__img" src="${esc(v.image || '')}" alt="Публікація у соцмережах"/><div class="social-post__body">${v.desc ? `<p class="social-post__desc">${esc(v.desc)}</p>` : ''}${links ? `<div class="social-post__links">${links}</div>` : ''}</div></div><button class="social-post__edit" type="button" title="Редагувати блок"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>`;
        return node;
      }
      static value(node: HTMLElement) {
        return {
          image: node.getAttribute('data-image') || '',
          fb:    node.getAttribute('data-fb')    || '',
          inst:  node.getAttribute('data-inst')  || '',
          desc:  node.getAttribute('data-desc')  || '',
        };
      }
    }
    (Quill as any).register({ 'formats/social-post': SocialPostBlot }, true);
  } catch { /* safe to ignore */ }
})();

// ── Article templates (unchanged) ────────────────────────────────────────────

export interface ArticleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  content: string;
  excerpt: string;
  categories: string[];
  tags: string[];
}

export const ARTICLE_TEMPLATES: ArticleTemplate[] = [
  {
    id: 'blank',
    name: 'Порожня стаття',
    description: 'Почати з чистого аркуша',
    icon: 'pi-file',
    content: '',
    excerpt: '',
    categories: [],
    tags: [],
  },
  {
    id: 'news',
    name: 'Новина',
    description: 'Коротке повідомлення про подію чи оновлення',
    icon: 'pi-megaphone',
    content: `<h2>Заголовок новини</h2>
<p>Введіть короткий вступ до новини. Опишіть найважливіше одним реченням.</p>
<h3>Деталі</h3>
<p>Розкрийте деталі події: що сталося, де, коли і чому це важливо.</p>
<h3>Що це означає для вас</h3>
<p>Поясніть, як ця новина може вплинути на пацієнтів або читачів.</p>`,
    excerpt: 'Коротко про головне...',
    categories: ['Новини'],
    tags: ['новини'],
  },
  {
    id: 'tips',
    name: 'Поради',
    description: 'Практичні рекомендації для покращення ментального здоровʼя',
    icon: 'pi-lightbulb',
    content: `<h2>Поради для покращення ментального здоровʼя</h2>
<p>Вступний абзац з поясненням теми та чому ці поради важливі.</p>
<h3>1. Перша порада</h3>
<p>Детальний опис першої поради та як її застосувати на практиці.</p>
<h3>2. Друга порада</h3>
<p>Детальний опис другої поради.</p>
<h3>3. Третя порада</h3>
<p>Детальний опис третьої поради.</p>
<h3>Висновок</h3>
<p>Підбийте підсумки та надихніть читача спробувати ці поради.</p>`,
    excerpt: 'Практичні поради для вашого ментального здоровʼя...',
    categories: ['Поради'],
    tags: ['поради', 'ментальне здоровʼя'],
  },
  {
    id: 'research',
    name: 'Дослідження',
    description: 'Огляд наукових досліджень у сфері психології',
    icon: 'pi-book',
    content: `<h2>Назва дослідження</h2>
<p><strong>Автори:</strong> ...<br><strong>Рік:</strong> ...<br><strong>Журнал:</strong> ...</p>
<h3>Вступ</h3>
<p>Опишіть контекст дослідження та проблему, яку воно вивчає.</p>
<h3>Методологія</h3>
<p>Як проводилося дослідження, яка вибірка, які методи використовувались.</p>
<h3>Ключові результати</h3>
<ul>
  <li>Результат 1</li>
  <li>Результат 2</li>
  <li>Результат 3</li>
</ul>
<h3>Висновки та значення</h3>
<p>Що означають ці результати для практики та пацієнтів.</p>`,
    excerpt: 'Огляд нового дослідження у сфері психічного здоровʼя...',
    categories: ['Дослідження'],
    tags: ['наука', 'дослідження'],
  },
  {
    id: 'story',
    name: 'Історія успіху',
    description: 'Надихаюча розповідь про шлях до одужання',
    icon: 'pi-heart',
    content: `<h2>Назва історії</h2>
<p><em>Імена та деталі змінено для захисту конфіденційності.</em></p>
<h3>Знайомство</h3>
<p>Розкажіть, хто ця людина та з чим вона прийшла до клініки.</p>
<h3>Виклики</h3>
<p>Опишіть труднощі, з якими зіткнулася людина на своєму шляху.</p>
<h3>Шлях до одужання</h3>
<p>Що допомогло, яку підтримку отримала людина, які кроки зробила.</p>
<h3>Результат</h3>
<p>Де зараз ця людина, чого вона досягла.</p>
<blockquote><p><em>"Цитата від пацієнта..."</em></p></blockquote>`,
    excerpt: 'Надихаюча історія про подолання труднощів...',
    categories: ['Історії'],
    tags: ['успіх', 'одужання'],
  },
  {
    id: 'info',
    name: 'Інформаційна стаття',
    description: 'Пояснення розладу, симптомів або методу лікування',
    icon: 'pi-info-circle',
    content: `<h2>Назва теми</h2>
<p>Короткий вступ, що пояснює, про що ця стаття і чому вона важлива.</p>
<h3>Що це таке?</h3>
<p>Дайте чітке визначення поняття доступною мовою.</p>
<h3>Симптоми та ознаки</h3>
<ul>
  <li>Ознака 1</li>
  <li>Ознака 2</li>
  <li>Ознака 3</li>
</ul>
<h3>Причини</h3>
<p>Опишіть відомі причини та фактори ризику.</p>
<h3>Лікування та підтримка</h3>
<p>Які підходи до лікування існують, як отримати допомогу.</p>
<h3>Коли звертатись до спеціаліста</h3>
<p>Чіткі ознаки того, що потрібна професійна допомога.</p>`,
    excerpt: 'Детальний огляд теми для пацієнтів та їх близьких...',
    categories: ['Інформація'],
    tags: ['освіта', 'здоровʼя'],
  },
];

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, TextareaModule,
            EditorModule, SelectButtonModule, AutoCompleteModule,
            ButtonModule, ToastModule, DialogModule],
  providers: [MessageService],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
})
export class ArticleFormComponent implements OnInit {
  private svc       = inject(ArticleService);
  private testSvc   = inject(TestService);
  private route     = inject(ActivatedRoute);
  private router    = inject(Router);
  private toast     = inject(MessageService);
  private sanitizer = inject(DomSanitizer);
  private el        = inject(ElementRef);

  private quillInstance: any = null;
  private editorReady = false;

  id      = signal<string | null>(null);
  loading = signal(false);
  saving  = signal(false);

  step           = signal<'template' | 'form'>('template');
  previewVisible = signal(false);

  // ── Media insert dialogs ───────────────────────────────────────────────────
  imageDialogVisible   = signal(false);
  youtubeDialogVisible = signal(false);
  socialDialogVisible  = signal(false);
  imageUrl    = '';
  youtubeUrl  = '';
  socialImage     = '';
  socialFb        = '';
  socialInst      = '';
  socialDesc      = '';
  socialEditIndex: number | null = null;
  imageUrlError   = '';
  youtubeUrlError = '';
  socialImgErr    = '';

  tagSuggestions: string[] = [];

  readonly CATEGORIES = [
    'Новини', 'Поради', 'Дослідження', 'Інформація', 'Історії',
    'Депресія', 'Тривога', 'Стрес', 'Сон', 'Залежності',
    'Дитяча психологія', 'Самодопомога', 'Відносини', 'Профілактика',
  ];

  isCategorySelected(cat: string): boolean {
    return (this.form.categories ?? []).includes(cat);
  }

  toggleCategory(cat: string): void {
    const current = this.form.categories ?? [];
    this.form.categories = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
  }
  templates  = ARTICLE_TEMPLATES;
  allTests: TestListItem[] = [];
  testSearchQuery = '';

  get filteredTests(): TestListItem[] {
    const q = this.testSearchQuery.trim().toLowerCase();
    return q ? this.allTests.filter(t => t.name.toLowerCase().includes(q)) : this.allTests;
  }

  isTestSelected(id: string): boolean {
    return (this.form.relatedTests ?? []).includes(id);
  }

  toggleTest(id: string): void {
    const current = this.form.relatedTests ?? [];
    this.form.relatedTests = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id];
  }


  statusOptions = [
    { label: 'Чернетка',    value: 'draft' },
    { label: 'Опубліковано', value: 'published' },
  ];

  form: ArticleDto = {
    title: '', content: '', excerpt: '',
    categories: [], tags: [],
    status: 'draft', coverImage: '',
    authorName: 'Євген Скрипник',
    relatedTests: [],
  };

  get isEdit() { return !!this.id(); }

  get iframePreviewUrl(): SafeResourceUrl {
    const url = `${environment.feUrl}/articles/${this.id()}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openPreview(): void {
    if (!this.id()) {
      this.toast.add({ severity: 'info', summary: 'Спершу збережіть статтю, щоб переглянути її на сайті', life: 3000 });
      return;
    }
    this.previewVisible.set(true);
  }

  ngOnInit() {
    this.testSvc.getAll().subscribe({ next: (tests) => (this.allTests = tests) });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.step.set('form');
      this.loading.set(true);
      this.svc.getById(id).subscribe({
        next: (a) => {
          this.form = {
            title: a.title,
            content: this.normalizeContent(a.content),
            excerpt: a.excerpt ?? '',
            categories: a.categories ?? [],
            tags: a.tags ?? [],
            status: a.status,
            coverImage: a.coverImage ?? '',
            authorName: a.authorName ?? 'Євген Скрипник',
            relatedTests: (a.relatedTests ?? []).map((t: any) => typeof t === 'string' ? t : t._id),
          };
          this.loading.set(false);
          // Give Angular + Quill time to re-render before initialising players
          setTimeout(() => this.maybeInitEditorPlayers(), 150);
        },
        error: () => {
          this.toast.add({ severity: 'error', summary: 'Не вдалося завантажити статтю' });
          this.loading.set(false);
        },
      });
    }
  }

  /** Called when Quill finishes initialising — wire up media handlers. */
  onEditorInit(event: { editor: any }): void {
    this.quillInstance = event.editor;
    this.editorReady   = true;
    const toolbar = event.editor.getModule('toolbar');

    toolbar.addHandler('image', () => {
      this.imageUrl      = '';
      this.imageUrlError = '';
      this.imageDialogVisible.set(true);
    });

    toolbar.addHandler('video', () => {
      this.youtubeUrl      = '';
      this.youtubeUrlError = '';
      this.youtubeDialogVisible.set(true);
    });

    // Edit button on important-block blots
    event.editor.root.addEventListener('click', (e: MouseEvent) => {
      const impBtn = (e.target as HTMLElement).closest('.important-block__edit');
      if (impBtn) {
        e.preventDefault(); e.stopPropagation();
        const blotEl = (impBtn as HTMLElement).closest('.important-block') as HTMLElement | null;
        if (blotEl) {
          this.importantText     = blotEl.getAttribute('data-text') || '';
          this.importantTextErr  = '';
          const blot = (Quill as any).find(blotEl);
          this.importantEditIndex = blot ? this.quillInstance.getIndex(blot) : null;
          this.importantDialogVisible.set(true);
        }
        return;
      }
    });

    // Edit button on social-post blots
    event.editor.root.addEventListener('click', (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest('.social-post__edit');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const blotEl = (btn as HTMLElement).closest('.social-post') as HTMLElement | null;
      if (!blotEl) return;
      this.socialImage    = blotEl.getAttribute('data-image') || '';
      this.socialFb       = blotEl.getAttribute('data-fb')    || '';
      this.socialInst     = blotEl.getAttribute('data-inst')  || '';
      this.socialDesc     = blotEl.getAttribute('data-desc')  || '';
      this.socialImgErr   = '';
      const blot = (Quill as any).find(blotEl);
      this.socialEditIndex = blot ? this.quillInstance.getIndex(blot) : null;
      this.socialDialogVisible.set(true);
    });

    this.maybeInitEditorPlayers();
  }

  /** Insert image from URL into the editor at the current cursor position. */
  confirmInsertImage(): void {
    const url = this.imageUrl.trim();
    if (!url) { this.imageUrlError = 'Введіть URL зображення'; return; }
    if (!/^https?:\/\/.+/i.test(url)) {
      this.imageUrlError = 'Введіть коректний URL (починається з https://)';
      return;
    }
    const index = this.quillInstance?.getSelection()?.index ?? this.quillInstance?.getLength() ?? 0;
    this.quillInstance?.insertEmbed(index, 'image', url, 'user');
    this.quillInstance?.setSelection(index + 1);
    this.imageDialogVisible.set(false);
  }

  importantDialogVisible = signal(false);
  importantText      = '';
  importantTextErr   = '';
  importantEditIndex: number | null = null;

  confirmInsertImportant(): void {
    const text = this.importantText.trim();
    if (!text) { this.importantTextErr = 'Введіть текст'; return; }
    if (this.quillInstance) {
      if (this.importantEditIndex !== null) {
        this.quillInstance.deleteText(this.importantEditIndex, 1, 'user');
        this.quillInstance.insertEmbed(this.importantEditIndex, 'important-block', text, 'user');
        this.quillInstance.setSelection(this.importantEditIndex + 1, 0, 'silent');
        this.importantEditIndex = null;
      } else {
        const index = this.quillInstance.getSelection(true)?.index ?? this.quillInstance.getLength() ?? 0;
        this.quillInstance.insertEmbed(index, 'important-block', text, 'user');
        this.quillInstance.setSelection(index + 1, 0, 'silent');
      }
    }
    this.importantDialogVisible.set(false);
  }

  confirmInsertSocial(): void {
    const image = this.socialImage.trim();
    if (!image) { this.socialImgErr = 'Введіть URL зображення'; return; }
    const value = {
      image,
      fb:   this.socialFb.trim()   || undefined,
      inst: this.socialInst.trim() || undefined,
      desc: this.socialDesc.trim() || undefined,
    };
    if (this.quillInstance) {
      if (this.socialEditIndex !== null) {
        this.quillInstance.deleteText(this.socialEditIndex, 1, 'user');
        this.quillInstance.insertEmbed(this.socialEditIndex, 'social-post', value, 'user');
        this.quillInstance.setSelection(this.socialEditIndex + 1, 0, 'silent');
        this.socialEditIndex = null;
      } else {
        const index = this.quillInstance.getSelection(true)?.index ?? this.quillInstance.getLength() ?? 0;
        this.quillInstance.insertEmbed(index, 'social-post', value, 'user');
        this.quillInstance.setSelection(index + 1, 0, 'silent');
      }
    }
    this.socialDialogVisible.set(false);
  }

  /** Extract YouTube ID, insert the custom yt-player blot into the editor. */
  confirmInsertYoutube(): void {
    const id = this.extractYouTubeId(this.youtubeUrl.trim());
    if (!id) {
      this.youtubeUrlError = 'Не вдалося розпізнати посилання YouTube. Приклад: https://youtu.be/XXXX або https://www.youtube.com/watch?v=XXXX';
      return;
    }

    if (this.quillInstance) {
      const index = this.quillInstance.getSelection(true)?.index
                 ?? this.quillInstance.getLength()
                 ?? 0;
      this.quillInstance.insertEmbed(index, 'yt-player', id, 'user');
      this.quillInstance.setSelection(index + 1, 0, 'silent');
      // Initialise the newly inserted player element
      setTimeout(() => this.initYtPlayers(
        this.el.nativeElement.querySelector('.ql-editor') as HTMLElement
      ), 100);
    } else {
      this.form.content =
        (this.form.content || '') +
        `<div class="yt-player" data-video-id="${id}"></div>`;
    }

    this.youtubeDialogVisible.set(false);
  }

  selectTemplate(tpl: ArticleTemplate) {
    this.form.content    = tpl.content;
    this.form.excerpt    = tpl.excerpt;
    this.form.categories = [...tpl.categories];
    this.form.tags       = [...tpl.tags];
    this.step.set('form');
  }

  searchTags(event: { query: string }) {
    this.tagSuggestions = event.query ? [event.query] : [];
  }

  save() {
    if (!this.form.title || !this.form.content) {
      this.toast.add({ severity: 'warn', summary: 'Заголовок та зміст є обовʼязковими' });
      return;
    }
    this.saving.set(true);
    const req = this.isEdit
      ? this.svc.update(this.id()!, this.form)
      : this.svc.create(this.form);

    req.subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: this.isEdit ? 'Статтю оновлено' : 'Статтю створено', life: 2000 });
        setTimeout(() => this.router.navigate(['/articles']), 1500);
      },
      error: (err) => {
        this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Помилка збереження' });
        this.saving.set(false);
      },
    });
  }

  cancel() { this.router.navigate(['/articles']); }

  // ── Private helpers ───────────────────────────────────────────────────────

  /**
   * Run initYtPlayers on the Quill editor container once both the editor and
   * the article content are ready.
   */
  private maybeInitEditorPlayers(): void {
    if (!this.editorReady) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const editorEl = this.el.nativeElement.querySelector('.ql-editor') as HTMLElement | null;
        this.initYtPlayers(editorEl);
      })
    );
  }

  /**
   * Convert any YouTube iframes / links in raw HTML to
   * `<div class="yt-player" data-video-id="…">` placeholders so that
   * Quill's registered blot preserves them and the player UI can be mounted.
   */
  private normalizeContent(html: string): string {
    if (!html) return html;

    const ytId = (url: string): string | null => {
      const patterns = [
        /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/watch\?[^"'\s]*v=([A-Za-z0-9_-]{11})/,
        /youtu\.be\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
      ];
      for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
      }
      return null;
    };

    const placeholder = (id: string) =>
      `<div class="yt-player" data-video-id="${id}"></div>`;

    // Quill VideoBlot: <iframe class="ql-video" src="…/embed/ID…">
    let out = html.replace(
      /<iframe\b[^>]*?src="([^"]*youtube[^"]*)"[^>]*?>\s*<\/iframe>/gi,
      (_m, src: string) => { const id = ytId(src); return id ? placeholder(id) : _m; },
    );

    // Any <a href="…youtu…"> link
    out = out.replace(
      /<a\b[^>]*?href="([^"]*youtu[^"]*)"[^>]*>.*?<\/a>/gis,
      (_m, href: string) => { const id = ytId(href); return id ? placeholder(id) : _m; },
    );

    return out;
  }

  /**
   * Find every `.yt-player` placeholder in `host` and mount the thumbnail
   * poster + primary-colour play button.  On click, the poster is swapped for
   * a native YouTube iframe (controls=1).
   */
  private initYtPlayers(host: HTMLElement | null): void {
    if (!host) return;
    const players = host.querySelectorAll<HTMLElement>('.yt-player:not([data-ready])');

    players.forEach(player => {
      const videoId = player.dataset['videoId'];
      if (!videoId) return;
      player.dataset['ready'] = '1';

      // Load thumbnail (hi-res with hq fallback)
      const lo  = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const hi  = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const img = new Image();
      img.onload  = () => { player.style.backgroundImage = `url('${img.src}')`; };
      img.onerror = () => { player.style.backgroundImage = `url('${lo}')`; };
      img.src = hi;

      // Poster: only the primary play button — no darkening overlay
      player.innerHTML = `
        <div class="yt-player__overlay">
          <button class="yt-player__play" type="button" aria-label="Відтворити відео">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <polygon points="6,3 20,12 6,21"/>
            </svg>
          </button>
        </div>`;

      player.addEventListener('click', (e) => {
        e.stopPropagation();
        this.activateYtPlayer(player, videoId);
      }, { once: true });
    });
  }

  /**
   * Replace the poster with a native YouTube iframe (YouTube supplies all
   * controls — no custom overlay needed).
   */
  private activateYtPlayer(container: HTMLElement, videoId: string): void {
    container.style.backgroundImage = '';
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src =
      `https://www.youtube.com/embed/${videoId}` +
      `?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`;
    iframe.setAttribute('allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
      'gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none';
    container.appendChild(iframe);
  }

  private extractYouTubeId(url: string): string | null {
    const patterns = [
      /[?&]v=([A-Za-z0-9_-]{11})/,
      /youtu\.be\/([A-Za-z0-9_-]{11})/,
      /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
      /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  }
}
