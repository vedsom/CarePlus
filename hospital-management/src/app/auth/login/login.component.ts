import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../patient/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null; // For displaying login errors

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.errorMessage = null; // Reset error on new attempt
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);

        // Redirect based on role
        if (res.role === 'admin') {
          this.router.navigate(['/admin']); // Or '/admin/dashboard'
        } else if (res.role === 'doctor') {
          this.router.navigate(['/doctor']); // Or '/doctor/dashboard'
        } else {
          // ** THE FIX: Redirect patients to the main home page **
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        // Better error handling than alert()
        this.errorMessage = err.error.error || 'Login failed. Please check your credentials.';
        console.error(err);
      }
    });
  }
}