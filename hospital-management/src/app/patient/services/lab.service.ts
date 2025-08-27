import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabBooking {
  booking_id: number;
  testName: string;
  date: string;
  timeSlot: string;
  type: string;
  status: string;
  user_id: number;
}

export interface LabTest {
  id: number;
  name: string;
  category: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class LabService {
  // FIXED: Use gateway URL instead of direct service URL
  private apiUrl = 'http://localhost:5000/api/labs';

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Public route to get lab tests
  getLabTests(): Observable<LabTest[]> {
    return this.http.get<LabTest[]>(`${this.apiUrl}/tests`);
  }

  // Protected routes with authentication
  getBookings(): Observable<LabBooking[]> {
    return this.http.get<LabBooking[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    });
  }

  createBooking(booking: Partial<LabBooking>): Observable<any> {
    return this.http.post<any>(this.apiUrl, booking, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateBooking(booking_id: number, payload: Partial<LabBooking>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${booking_id}`, payload, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteBooking(booking_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${booking_id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Legacy method names for backward compatibility
  rescheduleBooking(booking_id: number, payload: Partial<LabBooking>): Observable<any> {
    return this.updateBooking(booking_id, payload);
  }

  cancelBooking(booking_id: number): Observable<any> {
    return this.deleteBooking(booking_id);
  }
}