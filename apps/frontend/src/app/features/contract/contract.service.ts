import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONTRACT } from '../../app.constants';

export interface ContractDoc {
  content: string;
  visible: boolean;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContractApiService {
  constructor(private http: HttpClient) {}

  get() { return this.http.get<ContractDoc>(API_CONTRACT); }

  /** Only `visible`/`updatedAt` — for pages that link to the contract without showing it. */
  getMeta() { return this.http.get<Pick<ContractDoc, 'visible' | 'updatedAt'>>(API_CONTRACT, { params: { meta: 1 } }); }
}
