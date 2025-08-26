import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// Assuming you have a shared AuthService that can provide the admin's profile
import { AuthService, UserProfile } from '../../patient/services/auth.service';

@Component({
  selector: 'app-admin', // Make sure selector matches your component definition
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  // Property to hold the logged-in admin's profile
  adminProfile: UserProfile | null = null;
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the currentUser$ observable from your AuthService.
    // This ensures the adminProfile is always up-to-date.
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.adminProfile = user;
    });
  }

  ngOnDestroy(): void {
    // It's crucial to unsubscribe to prevent memory leaks when the component is destroyed.
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Logs the user out by calling the AuthService and navigates to the login page.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']); // Or your designated login route
  }

  /**
   * Generates initials from the admin's name for the user avatar.
   * @returns A string with one or two initials, or an empty string.
   */
  getAdminInitials(): string {
    if (!this.adminProfile?.name) {
      return 'A'; // Return a default initial if no name is found
    }

    const nameParts = this.adminProfile.name.trim().split(' ');
    if (nameParts.length === 1) {
      // For a single name, return the first letter
      return nameParts[0][0]?.toUpperCase() || '';
    }
    // For multiple names, return the first letter of the first two parts
    return (nameParts[0][0] + (nameParts[1][0] || '')).toUpperCase();
  }
}
