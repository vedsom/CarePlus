import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Referral {
  id: number;
  patient_name: string;
  reason: string;        // instead of disease_description
  referredBy: string; 
  referred_to: string;
  hospital: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class ReferralService {
  // Changed to use gateway URL instead of direct service URL
  private apiUrl = 'http://localhost:5000/api/referrals';

  constructor(private http: HttpClient) {}

  // Added method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Updated to include auth headers
  referPatient(referral: any): Observable<any> {
    return this.http.post(this.apiUrl, referral, {
      headers: this.getAuthHeaders()
    });
  }

  // Added method to get referrals
  getReferrals(): Observable<Referral[]> {
    return this.http.get<Referral[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Added method to get all referrals (alternative endpoint)
  getAllReferrals(): Observable<Referral[]> {
    return this.http.get<Referral[]>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders()
    });
  }
}