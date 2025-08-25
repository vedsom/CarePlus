import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

// An interface to define the structure of our user's profile
export interface UserProfile {
  id: number;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // CORRECT: This URL should point to your API Gateway
  private apiUrl = 'http://localhost:5000'; 
  
  // This property will hold the logged-in user's data for any component to access
  currentUser: UserProfile | null = null;

  constructor(private http: HttpClient) {
    // When the app first loads, check if a token already exists and load the user from it
    this.loadUserFromToken();
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(credentials: any): Observable<any> {
    // The 'tap' operator lets us perform an action when the login is successful
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        // After login, save the token and extract the user's profile
        this.saveTokenAndSetUser(res.token, credentials.email);
      })
    );
  }

  saveTokenAndSetUser(token: string, username: string): void {
    localStorage.setItem('token', token);
    
    // Decode the token to get user_id and role
    const decodedToken: any = jwtDecode(token);
    
    // Store the user's profile in the service
    this.currentUser = {
      id: decodedToken.user_id,
      name: username, // Using the email/username from the login form as the name
      role: decodedToken.role
    };
  }

  loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      // If a token is found in storage, decode it to restore the session
      const decodedToken: any = jwtDecode(token);
      this.currentUser = {
        id: decodedToken.user_id,
        // The name is not stored in the token, so we'd show a placeholder on refresh
        // A real app would make another API call here to get the full profile
        name: 'Welcome Back!', 
        role: decodedToken.role
      };
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null; // Clear the user profile on logout
  }
}