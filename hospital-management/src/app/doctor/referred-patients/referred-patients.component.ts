import { Component, OnInit } from '@angular/core';
import { ReferralService, Referral } from '../services/referral.service';

@Component({
  selector: 'app-referred-patients',
  templateUrl: './referred-patients.component.html',
  styleUrls: ['./referred-patients.component.css']
})
export class ReferredPatientsComponent implements OnInit {
  referrals: Referral[] = [];
  loading = true;
  error = '';

  constructor(private referralService: ReferralService) {}

  ngOnInit(): void {
    this.loadReferrals();
  }

  loadReferrals(): void {
    this.loading = true;
    this.error = '';
    
    this.referralService.getReferrals().subscribe({
      next: (data) => {
        console.log('Referrals loaded:', data);
        this.referrals = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch referrals', err);
        this.error = `Failed to load referrals: ${err.status} - ${err.error?.error || err.message}`;
        this.loading = false;
      }
    });
  }

  // Method to load all referrals if needed
  loadAllReferrals(): void {
    this.loading = true;
    this.error = '';
    
    this.referralService.getAllReferrals().subscribe({
      next: (data) => {
        console.log('All referrals loaded:', data);
        this.referrals = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch all referrals', err);
        this.error = `Failed to load referrals: ${err.status} - ${err.error?.error || err.message}`;
        this.loading = false;
      }
    });
  }
}