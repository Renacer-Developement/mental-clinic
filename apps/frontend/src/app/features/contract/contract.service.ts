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
}
