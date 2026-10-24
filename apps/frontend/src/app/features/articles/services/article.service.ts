import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ARTICLES } from '../../../app.constants';
import { Article, ArticleFacets, ArticleSort, PaginatedArticlesResponse } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  constructor(private http: HttpClient) {}

  getAll(
    search = '',
    category = '',
    page = 1,
    limit = 10,
    sort: ArticleSort = 'newest',
    offset?: number,
  ): Observable<PaginatedArticlesResponse> {
    let params = new HttpParams()
      .set('page',  page.toString())
      .set('limit', limit.toString());
    if (search)              params = params.set('search',   search);
    if (category)            params = params.set('category', category);
    if (sort !== 'newest')   params = params.set('sort',     sort);
    if (offset !== undefined) params = params.set('offset',  offset.toString());
    return this.http.get<PaginatedArticlesResponse>(API_ARTICLES, { params });
  }

  /** Published-article counts per category, for the topic filters. */
  getFacets(): Observable<ArticleFacets> {
    return this.http.get<ArticleFacets>(`${API_ARTICLES}/facets`);
  }

  getById(id: string): Observable<Article> {
    return this.http.get<Article>(`${API_ARTICLES}/${id}`);
  }

  getRelated(id: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${API_ARTICLES}/${id}/related`);
  }
}
