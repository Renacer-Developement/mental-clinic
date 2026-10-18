import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_TEAM } from '../../app.constants';

export type TeamCategory = 'psychiatrist' | 'psychologist';

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  category?: TeamCategory;
  bio: string;
  specializations: string[];
  photo: string;
  experience: string;
  isActive: boolean;
  order: number;
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(API_TEAM);
  }
}
