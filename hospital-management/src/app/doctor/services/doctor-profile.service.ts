import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorProfileService {
  private apiUrl = 'http://localhost:5000/api/doctor';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data);
  }
  
  // --- ADD THIS NEW METHOD ---
  createProfile(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile`, data);
  }

  getScheduleEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schedule/events`);
  }

  createScheduleEvent(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/schedule/events`, event);
  }
}