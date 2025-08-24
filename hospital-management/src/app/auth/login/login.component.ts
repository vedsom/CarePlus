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

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);

        // Redirect based on role
        if (res.role === 'admin') this.router.navigate(['/admin/dashboard']);
        else if (res.role === 'doctor') this.router.navigate(['/doctor/dashboard']);
        else this.router.navigate(['/patient/dashboard']);
      },
      error: (err) => alert(err.error.error || 'Login failed')
    });
  }
}
