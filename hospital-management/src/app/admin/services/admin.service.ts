import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/api';  // Gateway

  constructor(private http: HttpClient) {}

  // Dashboard stats
  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctor/stats`);
  }

  // Doctor APIs
  getDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctor`);
  }

  addDoctor(doctor: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/doctor`, doctor);
  }

  updateDoctor(id: number, doctor: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctor/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/doctor/${id}`);
  }

  // Export doctors as PDF
  downloadDoctorsPDF(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/doctor/export/pdf`, {
      responseType: 'blob'
    });
  }
}
