import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = 'http://localhost:5004/api/doctor/prescriptions';

  constructor(private http: HttpClient) {}

  createPrescription(patientId: number, content: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      patient_id: patientId,
      content: content
    });
  }

  addPrescription(patientId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { patient_id: patientId, content });
  }
}
