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
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.errorMessage = null;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        // REMOVE THIS LINE - the service now does this automatically
        // this.auth.saveToken(res.token); 
        
        // The service has already saved the token and user profile by this point.
        // We just need to navigate.
        if (res.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (res.role === 'doctor') {
          this.router.navigate(['/doctor']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.error || 'Login failed. Please check your credentials.';
        console.error(err);
      }
    });
  }
}