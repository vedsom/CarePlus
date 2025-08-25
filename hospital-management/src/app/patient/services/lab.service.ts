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
  // Fix 1: Update API URL to match Flask app.py url_prefix
  private apiUrl = 'http://127.0.0.1:5003/api/labs';

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming you store JWT token here
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Fix 2: Add method to get lab tests (public route)
  getLabTests(): Observable<LabTest[]> {
    return this.http.get<LabTest[]>(`${this.apiUrl}/tests`);
  }

  // Protected routes with authentication
  getBookings(): Observable<LabBooking[]> {
    return this.http.get<LabBooking[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    });
  }

  createBooking(booking: Partial<LabBooking>): Observable<LabBooking> {
    return this.http.post<LabBooking>(this.apiUrl, booking, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Fix 3: Add missing methods that your component calls
  updateBooking(booking_id: number, payload: Partial<LabBooking>): Observable<LabBooking> {
    return this.http.put<LabBooking>(`${this.apiUrl}/${booking_id}`, payload, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteBooking(booking_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${booking_id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Legacy method names for backward compatibility
  rescheduleBooking(booking_id: number, payload: Partial<LabBooking>): Observable<LabBooking> {
    return this.updateBooking(booking_id, payload);
  }

  cancelBooking(booking_id: number): Observable<any> {
    return this.deleteBooking(booking_id);
  }
}