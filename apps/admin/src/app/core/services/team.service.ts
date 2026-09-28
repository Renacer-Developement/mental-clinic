import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TeamMember, TeamMemberDto } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private base = `${environment.apiUrl}/team`;

  constructor(private http: HttpClient) {}

  getAll()                           { return this.http.get<TeamMember[]>(this.base); }
  getById(id: string)                { return this.http.get<TeamMember>(`${this.base}/${id}`); }
  getMyProfile()                     { return this.http.get<TeamMember | null>(`${this.base}/me/profile`, { withCredentials: true }); }
  updateMyProfile(dto: Partial<TeamMemberDto>) { return this.http.patch<TeamMember>(`${this.base}/me/profile`, dto, { withCredentials: true }); }
  create(dto: Partial<TeamMemberDto>){ return this.http.post<TeamMember>(this.base, dto, { withCredentials: true }); }
  update(id: string, dto: Partial<TeamMemberDto>) { return this.http.put<TeamMember>(`${this.base}/${id}`, dto, { withCredentials: true }); }
  patch(id: string, dto: Partial<TeamMemberDto>)  { return this.http.patch<TeamMember>(`${this.base}/${id}`, dto, { withCredentials: true }); }
  remove(id: string)                 { return this.http.delete<void>(`${this.base}/${id}`, { withCredentials: true }); }
}
