import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabBooking {
  booking_id: number;  // Changed from id to match backend
  testName: string;
  date: string;
  timeSlot: string;
  type: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabService {
  private apiUrl = 'http://127.0.0.1:5003/labs/';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<LabBooking[]> {
    return this.http.get<LabBooking[]>(this.apiUrl);
  }

  createBooking(booking: Partial<LabBooking>): Observable<LabBooking> {
    return this.http.post<LabBooking>(this.apiUrl, booking);
  }

  rescheduleBooking(booking_id: number, payload: Partial<LabBooking>): Observable<LabBooking> {
    // Ensure proper URL construction
    const url = `${this.apiUrl.replace(/\/$/, '')}/${booking_id}`;
    return this.http.put<LabBooking>(url, payload);
  }

  cancelBooking(booking_id: number): Observable<any> {
    // Ensure proper URL construction - remove trailing slash and add booking_id
    const url = `${this.apiUrl.replace(/\/$/, '')}/${booking_id}`;
    console.log('DELETE URL:', url); // Debug log
    return this.http.delete(url);
  }
}
