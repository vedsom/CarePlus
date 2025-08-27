import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  // keep only the base doctor URL
  private apiUrl = 'http://localhost:5000/api/doctor';

  constructor(private http: HttpClient) {}

  // create prescription
  createPrescription(patientId: number, medicines: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/prescriptions`, {
      patient_id: patientId,
      medicines: medicines
    });
  }

  // search medicines
  searchMedicines(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicines?query=${query}`);
  }

  // add prescription (duplicate of createPrescription, but keeping if you need it separately)
  addPrescription(prescription: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prescriptions`, prescription);
  }
}
