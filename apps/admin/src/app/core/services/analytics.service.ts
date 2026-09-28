import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AnalyticsSummary {
  sessions:    number;
  users:       number;
  pageViews:   number;
  bounceRate:  string;
  avgDuration: number;
  newUsers:    number;
}

export interface DailyStat {
  date:     string;
  sessions: number;
  users:    number;
}

export interface TopPage {
  path:  string;
  title: string;
  views: number;
}

export interface TrafficSource { source: string; sessions: number; }
export interface DeviceStat    { device: string;  sessions: number; }

export interface AnalyticsData {
  summary:  AnalyticsSummary;
  daily:    DailyStat[];
  topPages: TopPage[];
  sources:  TrafficSource[];
  devices:  DeviceStat[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<AnalyticsData>(`${environment.apiUrl}/analytics`);
  }
}
