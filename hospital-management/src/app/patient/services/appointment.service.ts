import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the structure of an Appointment object
export interface Appointment {
  id?: number;
  patientName: string;
  date: string;
  time: string;
  doctorId: string | number;
  doctorName: string;
  diseaseDescription?: string;
  cancelled?: boolean;
  user_id?: number;
  speciality?: string; // Optional field for doctor's specialty
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  // This URL should point to your API Gateway
  private apiUrl = 'http://localhost:5000/api/appointments'; 

  constructor(private http: HttpClient) {}

  /**
   * Fetches all appointments for the logged-in user.
   */
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  /**
   * Books a new appointment.
   */
  bookAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  /**
   * ✅ ADDED: Updates an existing appointment.
   * This is used by your "Save" button when rescheduling.
   */
  updateAppointment(id: number, appointmentData: Partial<Appointment>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, appointmentData);
  }

  /**
   * ✅ ADDED: Deletes an appointment.
   * This is used by your "Cancel" button.
   */
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}