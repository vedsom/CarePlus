import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:5000/api/doctor';  // ✅ Gateway, not microservice

  constructor(private http: HttpClient) {}

  // Get all doctors
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  // Add a doctor
  addDoctor(doctorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, doctorData);
  }

  // Count doctors
  getDoctorCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
