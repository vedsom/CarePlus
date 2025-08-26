import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorProfileService {
  private apiUrl = 'http://localhost:5000/api/doctor';

  constructor(private http: HttpClient) {}

  // --- THIS IS THE FIX ---
  // The method no longer needs a doctorId parameter
  getProfile(): Observable<any> {
    // The URL should not include an ID at the end
    return this.http.get(`${this.apiUrl}/profile`);
  }
  // --- END OF FIX ---

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data);
  }

  updateSchedule(schedule: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/schedule`, { schedule });
  }
}
