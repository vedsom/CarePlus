import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, UserProfile } from '../../patient/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  doctorProfile: UserProfile | null = null;
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the currentUser$ observable.
    // This will automatically update doctorProfile whenever the data changes.
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.doctorProfile = user;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks when the component is destroyed
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // Helper function to get initials from the doctor's name
  getDoctorInitials(): string {
    if (!this.doctorProfile?.name) return '';
    const nameParts = this.doctorProfile.name.split(' ');
    if (nameParts.length < 2) return nameParts[0]?.[0]?.toUpperCase() || '';
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
}
