import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Test, TestListItem } from '../models/test.model';

@Injectable({ providedIn: 'root' })
export class TestService {
  private base = `${environment.apiUrl}/tests`;

  constructor(private http: HttpClient) {}

  getAll(filters: Record<string, string> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => v && (params = params.set(k, v)));
    return this.http.get<TestListItem[]>(this.base, { params });
  }

  getById(id: string) {
    return this.http.get<Test>(`${this.base}/${id}`);
  }

  create(dto: Partial<Test>) {
    return this.http.post<Test>(this.base, dto);
  }

  update(id: string, dto: Partial<Test>) {
    return this.http.put<Test>(`${this.base}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
