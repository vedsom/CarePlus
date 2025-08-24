import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../patient/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = 'patient'; // Default role

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register({ username: this.username, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: (res) => {
          alert('Registration successful! Login now.');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => alert(err.error.error || 'Registration failed')
      });
  }
}
