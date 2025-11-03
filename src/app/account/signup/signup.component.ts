import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="account-page">
      <div class="form-container">
        <h1 class="form-title">Create New Account</h1>

        @if (errorMessage()) {
          <div class="alert error">{{ errorMessage() }}</div>
        }
        
        <form #signupForm="ngForm" (ngSubmit)="onSubmit(signupForm)">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" [(ngModel)]="signupData.firstName" required>
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" [(ngModel)]="signupData.lastName" required>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" [(ngModel)]="signupData.email" required email>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" [(ngModel)]="signupData.password" required minlength="6">
          </div>

          <div class="form-group">
            <label for="phone">Phone Number (Optional)</label>
            <input type="tel" id="phone" name="phone" [(ngModel)]="signupData.phone">
          </div>

          <button type="submit" class="submit-btn" [disabled]="signupForm.invalid">Sign Up</button>
        </form>
        
        <p class="switch-link">Already have an account? <a routerLink="/account/login">Login here</a></p>
      </div>
    </div>
  `,
  styleUrls: ['../account-styles.css']
})
export class SignupComponent {
  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  };
  
  errorMessage = signal<string | null>(null);

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: any): void {
    this.errorMessage.set(null);
    if (form.valid) {
      this.authService.signup(this.signupData).subscribe({
        next: (response) => {
          this.authService.setToken(response);
          this.router.navigate(['/account/profile']);
        },
        error: (error) => {
          this.errorMessage.set(error.error || 'Registration failed. Please try again.');
        }
      });
    }
  }
}