import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Doctor Management
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/doctors`, { 
      headers: this.getHeaders() 
    });
  }

  addDoctor(doctorData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/doctors`, doctorData, { 
      headers: this.getHeaders() 
    });
  }

  updateDoctor(id: number, doctorData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/doctors/${id}`, doctorData, { 
      headers: this.getHeaders() 
    });
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/doctors/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Patient Management
  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/patients`, { 
      headers: this.getHeaders() 
    });
  }

  getPatientCount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/patients/count`, { 
      headers: this.getHeaders() 
    });
  }

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`, { 
      headers: this.getHeaders() 
    });
  }

  getDoctorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/doctors/${id}`, {
      headers: this.getHeaders()
    });
  }

  // PDF Export
  downloadDoctorsPDF(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/doctors/pdf`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }
}