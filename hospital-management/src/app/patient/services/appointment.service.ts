import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id?: number; 
  patientName: string;
  date: string;
  doctorId: number | string;
  doctorName: string;
  time: string;
  diseaseDescription: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:5001/api/appointments';  // ✅ Flask Gateway URL

  constructor(private http: HttpClient) {}

  bookAppointment(appointment: Appointment): Observable<any> {
    return this.http.post<any>(this.apiUrl, appointment);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, appointment);
}

}
