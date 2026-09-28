import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { TestService } from '../../../core/services/test.service';
import { Test, Question } from '../../../core/models/test.model';

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, TextareaModule,
            ButtonModule, ToastModule, AccordionModule, InputNumberModule, SelectModule, MessageModule],
  providers: [MessageService],
  templateUrl: './test-form.component.html',
  styleUrl: './test-form.component.scss',
})
export class TestFormComponent implements OnInit {
  private svc    = inject(TestService);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private toast  = inject(MessageService);

  id      = signal<string | null>(null);
  loading = signal(false);
  saving  = signal(false);

  form: Partial<Test> = {
    name: '', description: '', type: '', specialTest: '',
    duration: '', instructions: '', whyTest: '', pdfLink: '',
    commonMessage: '', questions: [], resultInterpretation: [], factor: [],
  };

  readonly typeOptions = [
    { label: 'Тривожність',            value: 'anxiety' },
    { label: 'Депресія',               value: 'depression' },
    { label: 'Стрес',                  value: 'stress' },
    { label: 'ОКР',                    value: 'ocd' },
    { label: 'ПТСР',                   value: 'ptsd' },
    { label: 'Біполярний розлад',      value: 'bipolar' },
    { label: 'Розлад особистості',     value: 'personality' },
    { label: 'Поведінкові розлади',    value: 'behavioral-disorders' },
    { label: 'Харчова поведінка',      value: 'eating' },
    { label: 'Залежності',             value: 'addiction' },
    { label: 'Когнітивна функція',     value: 'cognitive' },
    { label: 'Самооцінка',             value: 'selfesteem' },
    { label: 'РДУГ',                   value: 'adhd' },
    { label: 'Нейророзвиток',          value: 'neurodevelopmental' },
    { label: 'Повторювана поведінка',  value: 'repetitive-behavior' },
    { label: 'Спеціалізований',        value: 'specialized' },
  ];

  get isEdit() { return !!this.id(); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.loading.set(true);
      this.svc.getById(id).subscribe({
        next: (t) => { this.form = { ...t }; this.loading.set(false); },
        error: ()  => { this.toast.add({ severity: 'error', summary: 'Failed to load' }); this.loading.set(false); },
      });
    }
  }

  addQuestion() {
    this.form.questions = [...(this.form.questions ?? []), { labelText: [], value: [] }];
  }

  removeQuestion(i: number) {
    this.form.questions = this.form.questions!.filter((_, idx) => idx !== i);
  }

  addInterpretation() {
    this.form.resultInterpretation = [
      ...(this.form.resultInterpretation ?? []),
      { range: [0, null as any], result: '', questionIndex: [] },
    ];
  }

  removeInterpretation(i: number) {
    this.form.resultInterpretation = this.form.resultInterpretation!.filter((_, idx) => idx !== i);
  }

  getRangeMin(interp: any): number | null {
    return interp.range?.[0] ?? null;
  }

  getRangeMax(interp: any): number | null {
    return interp.range?.[1] ?? null;
  }

  setRangeMin(interp: any, val: string) {
    if (!interp.range) interp.range = [null, null];
    interp.range = [val === '' ? null : Number(val), interp.range[1]];
  }

  setRangeMax(interp: any, val: string) {
    if (!interp.range) interp.range = [null, null];
    interp.range = [interp.range[0], val === '' ? null : Number(val)];
  }

  addAnswer(q: Question) {
    q.labelText = [...(q.labelText ?? []), ''];
    q.value     = [...(q.value ?? []), 0];
  }

  removeAnswer(q: Question, i: number) {
    q.labelText = q.labelText!.filter((_, idx) => idx !== i);
    q.value     = q.value!.filter((_, idx) => idx !== i);
  }

  save() {
    const required = ['name','description','type','duration','instructions','whyTest','commonMessage'];
    if (required.some(k => !(this.form as any)[k])) {
      this.toast.add({ severity: 'warn', summary: 'Please fill all required fields' });
      return;
    }
    this.saving.set(true);
    const req = this.isEdit
      ? this.svc.update(this.id()!, this.form)
      : this.svc.create(this.form);

    req.subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: this.isEdit ? 'Test updated' : 'Test created', life: 2000 });
        setTimeout(() => this.router.navigate(['/tests']), 1500);
      },
      error: (err) => {
        this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Save failed' });
        this.saving.set(false);
      },
    });
  }

  cancel() { this.router.navigate(['/tests']); }
}
