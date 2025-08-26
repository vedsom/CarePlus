import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

// Define the structure for the user's profile
export interface UserProfile {
  id: number;
  name: string;
  role: string;
  specialization?: string; // Add optional specialization
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';
  
  // Use a BehaviorSubject to store and stream the user profile data
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  // Public getter to easily access the current profile value
  public get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  // --- THIS IS THE MISSING METHOD ---
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }
  // --- END OF FIX ---

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        this.saveTokenAndSetUser(res.token, credentials.email);
      })
    );
  }

  saveTokenAndSetUser(token: string, username: string): void {
    localStorage.setItem('token', token);
    const decodedToken: any = jwtDecode(token);
    const userProfile: UserProfile = {
      id: decodedToken.user_id,
      name: username,
      role: decodedToken.role
    };
    // Push the new profile data to all listening components
    this.currentUserSubject.next(userProfile);
  }

  loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userProfile: UserProfile = {
        id: decodedToken.user_id,
        name: 'Dr. User', // Placeholder name on initial load
        role: decodedToken.role
      };
      this.currentUserSubject.next(userProfile);
    }
  }

  // This new method allows the ProfileComponent to update the shared user data
  updateUserProfile(profileData: any): void {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      const updatedProfile: UserProfile = {
        ...currentUser, // Keep existing data like ID and role
        name: profileData.name,
        specialization: profileData.specialization
      };
      // Push the updated profile to all listening components
      this.currentUserSubject.next(updatedProfile);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null); // Clear the profile on logout
  }
}
