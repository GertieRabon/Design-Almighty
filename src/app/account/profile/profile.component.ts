import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="account-page">
      <div class="form-container profile-container">
        <h1 class="form-title">Welcome, {{ user()?.firstName }}!</h1>
        <p class="section-description">Manage your account details and view your activity.</p>

        @if (user()) {
          <div class="profile-info-grid">
            <div class="info-item">
              <span class="label">User ID:</span>
              <span class="value">{{ user()!.userId }}</span>
            </div>
            <div class="info-item">
              <span class="label">Full Name:</span>
              <span class="value">{{ user()!.firstName }} {{ user()!.lastName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ user()!.email }}</span>
            </div>
          </div>

          <div class="profile-actions">
            <a routerLink="/order" class="action-btn view-orders">View Orders</a>
            <button class="action-btn update-profile">Update Profile (Future)</button>
            <button class="action-btn logout-btn" (click)="onLogout()">Logout</button>
          </div>
        }
        @else {
          <p>You must be logged in to view your profile.</p>
          <a routerLink="/account/login" class="action-btn submit-btn">Go to Login</a>
        }
      </div>
    </div>
  `,
  styleUrls: ['../account-styles.css']
})
export class ProfileComponent implements OnInit {
  user = signal<any>(null);
  
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.user.set(this.authService.getCurrentUser());
    if (!this.user()) {
      // Redirect unauthenticated users to login if they try to access the profile directly
      this.router.navigate(['/account/login']);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }
}