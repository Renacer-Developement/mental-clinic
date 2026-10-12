import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type FeedbackStatus = 'new' | 'in_progress' | 'done' | 'spam';

/** A "call me back" request left through the public site's feedback form. */
export interface Feedback {
  _id:           string;
  name:          string;
  phone:         string;
  contactMethod: 'phone' | 'telegram' | 'viber';
  message:       string;
  pagePath:      string;
  status:        FeedbackStatus;
  note:          string;
  createdAt:     string;
  updatedAt:     string;
}

export interface FeedbackList {
  items:  Feedback[];
  counts: Record<FeedbackStatus, number>;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private base = `${environment.apiUrl}/feedback`;

  /** Unhandled requests, for the sidebar badge. */
  readonly newCount = signal(0);

  constructor(private http: HttpClient) {}

  getAll(status?: FeedbackStatus) {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<FeedbackList>(this.base, { params }).pipe(
      tap(res => this.newCount.set(res.counts.new)),
    );
  }

  update(id: string, data: Partial<Pick<Feedback, 'status' | 'note'>>) {
    return this.http.patch<Feedback>(`${this.base}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
