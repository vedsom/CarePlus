import { Component } from '@angular/core';
import { ReferralService } from '../services/referral.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html'
})
export class ReferralsComponent {
  referral = { patient_id: '', hospital: '' };

  constructor(private referralService: ReferralService) {}

  addReferral() {
    this.referralService.referPatient(
      Number(this.referral.patient_id),
      this.referral.hospital
    ).subscribe(() => {
      alert("Referral added!");
      this.referral.hospital = '';
      this.referral.patient_id = '';
    });
  }
}
