import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../patient/services/auth.service'; // Note: Adjust this path if needed

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // Inject AuthService and Router here
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout(); // This will now work
    this.router.navigate(['/auth/login']); // This will also work
  }

}