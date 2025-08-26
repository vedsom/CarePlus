import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private apiUrl = 'http://localhost:5000/api/doctor/referrals'; // backend not implemented yet

  constructor(private http: HttpClient) {}

  // Placeholder until backend is ready
  referPatient(patientId: number, hospital: string): Observable<any> {
  return this.http.post(this.apiUrl, { patient_id: patientId, hospital });
}

}
