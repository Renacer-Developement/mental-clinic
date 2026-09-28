import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_REVIEWS } from '../../app.constants';

export interface Review {
  _id?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  photo?: string;
  status?: string;
  order?: number;
  createdAt?: string;
}

export interface ReviewsPage {
  data: Review[];
  total: number;
  page: number;
  hasMore: boolean;
  avgRating: number;
}

export interface SubmitReview {
  name: string;
  text: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  getPublic(page = 1, limit = 9): Observable<ReviewsPage> {
    return this.http.get<ReviewsPage>(`${API_REVIEWS}/public`, { params: { page, limit } });
  }

  submit(data: SubmitReview): Observable<Review> {
    return this.http.post<Review>(API_REVIEWS, data);
  }
}
