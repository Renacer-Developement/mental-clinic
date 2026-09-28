import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ArticleService } from '../../core/services/article.service';
import { TestService } from '../../core/services/test.service';
import { AnalyticsService, AnalyticsData } from '../../core/services/analytics.service';

interface Stat { label: string; value: number | string; icon: string; color: string; suffix?: string; }

const SOURCE_LABELS: Record<string, string> = {
  'Organic Search':  'Пошук',
  'Direct':          'Прямий',
  'Organic Social':  'Соцмережі',
  'Referral':        'Реферал',
  'Paid Search':     'Платний пошук',
  'Email':           'Email',
  'Affiliates':      'Партнери',
  '(other)':         'Інше',
  'Unassigned':      'Невідомо',
};

const DEVICE_LABELS: Record<string, string> = {
  mobile:  'Мобільний',
  desktop: "Комп'ютер",
  tablet:  'Планшет',
};

const CHART_PALETTE = ['#5f75d6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, SkeletonModule, TableModule, MessageModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private articleSvc   = inject(ArticleService);
  private testSvc      = inject(TestService);
  private analyticsSvc = inject(AnalyticsService);
  private router       = inject(Router);

  contentStats = signal<Stat[]>([
    { label: 'Всього статей', value: 0, icon: 'pi-file-edit',    color: '#5f75d6' },
    { label: 'Опубліковано',  value: 0, icon: 'pi-check-circle', color: '#22c55e' },
    { label: 'Чернетки',      value: 0, icon: 'pi-pencil',       color: '#f59e0b' },
    { label: 'Всього тестів', value: 0, icon: 'pi-clipboard',    color: '#003168' },
  ]);

  contentLoading = signal(true);

  gaStats       = signal<Stat[]>([]);
  gaLoading     = signal(true);
  gaError       = signal<string | null>(null);

  chartData     = signal<any>(null);
  chartOptions  = signal<any>(null);
  topPages      = signal<{ path: string; title: string; views: number }[]>([]);

  sourcesChart  = signal<any>(null);
  devicesChart  = signal<any>(null);
  donutOptions  = signal<any>(null);

  readonly quickActions = [
    { label: 'Нова стаття',      icon: 'pi-file-edit',  color: '#5f75d6', route: '/articles/new' },
    { label: 'Новий тест',       icon: 'pi-clipboard',  color: '#003168', route: '/tests/new'    },
    { label: 'Новий спеціаліст', icon: 'pi-user-plus',  color: '#22c55e', route: '/team/new'     },
  ];

  ngOnInit() {
    this.loadContent();
    this.loadGA4();
    this.buildChartOptions();
    this.buildDonutOptions();
  }

  navigate(route: string) { this.router.navigate([route]); }

  private loadContent() {
    forkJoin([this.articleSvc.getAll(), this.testSvc.getAll()]).subscribe({
      next: ([articles, tests]) => {
        this.contentStats.update(s => {
          const u = [...s];
          u[0] = { ...u[0], value: articles.length };
          u[1] = { ...u[1], value: articles.filter(a => a.status === 'published').length };
          u[2] = { ...u[2], value: articles.filter(a => a.status === 'draft').length };
          u[3] = { ...u[3], value: tests.length };
          return u;
        });
        this.contentLoading.set(false);
      },
      error: () => this.contentLoading.set(false),
    });
  }

  private loadGA4() {
    this.gaLoading.set(true);
    this.analyticsSvc.getAll().subscribe({
      next: (data: AnalyticsData) => {
        const s = data.summary;
        this.gaStats.set([
          { label: 'Сесії',            value: s.sessions,   icon: 'pi-users',    color: '#5f75d6' },
          { label: 'Користувачі',      value: s.users,      icon: 'pi-user',     color: '#22c55e' },
          { label: 'Нові користувачі', value: s.newUsers,   icon: 'pi-user-plus',color: '#6c86f5' },
          { label: 'Перегляди',        value: s.pageViews,  icon: 'pi-eye',      color: '#003168' },
          { label: 'Відмов',           value: s.bounceRate, icon: 'pi-sign-out', color: '#f59e0b', suffix: '%' },
          { label: 'Сер. тривалість',  value: this.formatDuration(s.avgDuration), icon: 'pi-clock', color: '#ef4444' },
        ]);
        this.topPages.set(data.topPages);
        this.buildChartData(data.daily);
        this.buildSourcesChart(data.sources ?? []);
        this.buildDevicesChart(data.devices ?? []);
        this.gaLoading.set(false);
      },
      error: (err) => {
        this.gaError.set(err.error?.hint ?? 'Не вдалося завантажити дані GA4');
        this.gaLoading.set(false);
      },
    });
  }

  private buildChartData(daily: { date: string; sessions: number; users: number }[]) {
    this.chartData.set({
      labels: daily.map(d => this.formatDate(d.date)),
      datasets: [
        {
          label: 'Сесії',
          data: daily.map(d => d.sessions),
          borderColor: '#5f75d6',
          backgroundColor: 'rgba(95,117,214,0.08)',
          fill: true, tension: 0.4, pointRadius: 3,
        },
        {
          label: 'Користувачі',
          data: daily.map(d => d.users),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.06)',
          fill: true, tension: 0.4, pointRadius: 3,
        },
      ],
    });
  }

  private buildSourcesChart(sources: { source: string; sessions: number }[]) {
    this.sourcesChart.set({
      labels: sources.map(s => SOURCE_LABELS[s.source] ?? s.source),
      datasets: [{
        data: sources.map(s => s.sessions),
        backgroundColor: CHART_PALETTE,
        borderWidth: 2,
        borderColor: '#fff',
      }],
    });
  }

  private buildDevicesChart(devices: { device: string; sessions: number }[]) {
    this.devicesChart.set({
      labels: devices.map(d => DEVICE_LABELS[d.device] ?? d.device),
      datasets: [{
        data: devices.map(d => d.sessions),
        backgroundColor: ['#5f75d6', '#22c55e', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    });
  }

  private buildChartOptions() {
    this.chartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 12 }, color: '#6b7280' } },
      },
      scales: {
        x: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af', maxTicksLimit: 10 } },
        y: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af' }, beginAtZero: true },
      },
    });
  }

  private buildDonutOptions() {
    this.donutOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { font: { size: 12 }, color: '#374151', padding: 16 },
        },
      },
      cutout: '65%',
    });
  }

  private formatDate(raw: string): string {
    const y = raw.slice(0, 4), m = raw.slice(4, 6), d = raw.slice(6, 8);
    return `${d}.${m}`;
  }

  formatDuration(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}хв ${s}с` : `${s}с`;
  }
}
