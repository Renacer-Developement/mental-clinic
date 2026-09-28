import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ContractDoc {
  _id: string;
  content: string;
  visible: boolean;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContractService {
  private url = `${environment.apiUrl}/contract`;

  constructor(private http: HttpClient) {}

  get() { return this.http.get<ContractDoc>(this.url); }

  update(content: string, visible: boolean) {
    return this.http.put<ContractDoc>(this.url, { content, visible });
  }
}
