import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Article, ArticleDto } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private base = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  getAll(filters: Record<string, string> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => v && (params = params.set(k, v)));
    return this.http.get<Article[]>(this.base, { params });
  }

  getById(id: string) {
    return this.http.get<Article>(`${this.base}/${id}`);
  }

  create(dto: ArticleDto) {
    return this.http.post<Article>(this.base, dto);
  }

  update(id: string, dto: Partial<ArticleDto>) {
    return this.http.put<Article>(`${this.base}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
