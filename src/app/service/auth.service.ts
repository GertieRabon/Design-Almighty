import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Mimicking DTO interfaces for TypeScript typing
interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  private readonly tokenKey = 'authToken';
  private readonly userKey = 'currentUser';
  
  // Use inject() to follow best practices
  constructor() {
    const http = inject(HttpClient); 
    super(http, '/api/auth');
  }

  // API Call: Registration (POST to /api/auth/signup)
  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.add(request); // Inherited method posts to /api/auth
  }

  // API Call: Login (POST to /api/auth/login)
  login(request: LoginRequest): Observable<AuthResponse> {
    // Manually construct the URL for the /login endpoint
    return this.http.post<AuthResponse>(`${this.apiServerUrl}${this.path}/login`, request);
  }

  // --- Token and User Management ---
  setToken(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify({
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName
    }));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): { userId: number, email: string, firstName: string, lastName: string } | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    // Fetches the raw token from local storage
    return localStorage.getItem(this.tokenKey);
  }
}