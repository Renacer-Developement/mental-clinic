import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_SEARCH } from '../../app.constants';

export interface SearchResult {
  kind: 'article' | 'test' | 'page';
  url: string;
  title: string;
  snippet: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  /** 'keyword' while the backend has no embeddings key or Voyage is down */
  mode: 'hybrid' | 'keyword';
}

// `ng serve` talks to a backend started locally on its default port
const API = isDevMode() ? 'http://localhost:10000/api/search' : API_SEARCH;

@Injectable({ providedIn: 'root' })
export class SiteSearchService {
  private readonly http = inject(HttpClient);

  search(q: string, limit = 20): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(API, { params: { q, limit } });
  }
}
