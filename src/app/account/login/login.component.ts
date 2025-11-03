import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="account-page">
      <div class="form-container">
        <h1 class="form-title">Login to Your Account</h1>
        
        @if (errorMessage()) {
          <div class="alert error">{{ errorMessage() }}</div>
        }
        
        <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" [(ngModel)]="loginData.email" required email>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" [(ngModel)]="loginData.password" required minlength="6">
          </div>

          <button type="submit" class="submit-btn" [disabled]="loginForm.invalid">Login</button>
        </form>
        
        <p class="switch-link">Don't have an account? <a routerLink="/account/signup">Sign Up here</a></p>
      </div>
    </div>
  `,
  styleUrls: ['../account-styles.css']
})
export class LoginComponent {
  loginData = {
    email: 'test@example.com', // Pre-fill with test data
    password: 'password123'    // Pre-fill with test data
  };
  
  errorMessage = signal<string | null>(null);
  
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: any): void {
    this.errorMessage.set(null);
    if (form.valid) {
      this.authService.login(this.loginData).subscribe({
        next: (response) => {
          this.authService.setToken(response);
          this.router.navigate(['/account/profile']);
        },
        error: (error) => {
          this.errorMessage.set(error.error || 'Login failed. Please check your credentials.');
        }
      });
    }
  }
}