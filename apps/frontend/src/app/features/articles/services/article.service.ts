import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ARTICLES } from '../../../app.constants';
import { Article, PaginatedArticlesResponse } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  constructor(private http: HttpClient) {}

  getAll(
    search = '',
    category = '',
    page = 1,
    limit = 10,
  ): Observable<PaginatedArticlesResponse> {
    let params = new HttpParams()
      .set('page',  page.toString())
      .set('limit', limit.toString());
    if (search)   params = params.set('search',   search);
    if (category) params = params.set('category', category);
    return this.http.get<PaginatedArticlesResponse>(API_ARTICLES, { params });
  }

  getById(id: string): Observable<Article> {
    return this.http.get<Article>(`${API_ARTICLES}/${id}`);
  }

  getRelated(id: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${API_ARTICLES}/${id}/related`);
  }
}
