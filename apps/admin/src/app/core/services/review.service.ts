import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Review {
  _id:       string;
  name:      string;
  role:      string;
  text:      string;
  rating:    number;
  photo:     string;
  status:    'pending' | 'approved' | 'rejected';
  order:     number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private base = `${environment.apiUrl}/reviews`;
  constructor(private http: HttpClient) {}

  getAll(status?: string) {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<Review[]>(this.base, { params });
  }

  update(id: string, data: Partial<Review>) {
    return this.http.put<Review>(`${this.base}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
