import { Component } from '@angular/core';
import { ReferralService } from '../services/referral.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.css']
})
export class ReferralsComponent {
  referral = {
    patient_id: '',
    patient_name: '',
    disease_description: '',
    referred_by: '',
    referred_to: '',
    hospital: ''
  };

  constructor(private referralService: ReferralService) {}

  addReferral() {
    this.referralService.referPatient(this.referral).subscribe(() => {
      alert("Referral added!");
      this.referral = { patient_id: '', patient_name: '', disease_description: '', referred_by: '', referred_to: '', hospital: '' };
    });
  }
}
