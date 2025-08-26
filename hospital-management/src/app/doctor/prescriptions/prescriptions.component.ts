import { Component } from '@angular/core';
import { PrescriptionService } from '../services/prescription.service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html'
})
export class PrescriptionsComponent {
  prescription = { patient_id: '', content: '' };
  doctorId = 1; // from login later

  constructor(private prescriptionService: PrescriptionService) {}

  addPrescription() {
    this.prescriptionService.addPrescription(
      Number(this.prescription.patient_id),
      this.prescription.content
    ).subscribe(() => {
      alert("Prescription added!");
      this.prescription.content = '';
      this.prescription.patient_id = '';
    });
  }
}
