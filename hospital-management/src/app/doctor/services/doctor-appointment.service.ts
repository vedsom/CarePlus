import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorAppointmentService {
  private apiUrl = 'http://localhost:5004/api/doctor/appointments';

  constructor(private http: HttpClient) {}

  // Get all appointments for logged-in doctor
  getAppointments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Update appointment status (e.g. Completed, Cancelled)
  updateAppointment(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { status });
  }
}
