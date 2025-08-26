import { Component, OnInit } from '@angular/core';
import { DoctorProfileService } from '../services/doctor-profile.service';
import { AuthService } from '../../patient/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  doctor: any;

  constructor(
    private profileService: DoctorProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUser;

    if (currentUser) {
      // --- THIS IS THE FIX ---
      // Call getProfile without any arguments
      this.profileService.getProfile().subscribe(data => {
        this.doctor = data;
      });
      // --- END OF FIX ---
    } else {
      console.error("Could not find logged-in user's information.");
    }
  }
}