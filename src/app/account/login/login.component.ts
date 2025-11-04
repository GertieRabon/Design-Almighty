// src/app/account/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="account-page">
      <div class="form-container">
        <h1 class="form-title">Welcome Back</h1>
        
        <div class="alert error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" 
                   [(ngModel)]="email" required autocomplete="email">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" 
                   [(ngModel)]="password" required autocomplete="current-password">
          </div>

          <button type="submit" class="submit-btn" [disabled]="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="switch-link">
          Don't have an account? <a routerLink="/account/signup">Sign up here</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Uses styles from account-styles.css */
    .account-page {
      font-family: 'Inter', sans-serif;
      background-color: #DFD7E4;
      min-height: 100vh;
      padding: 80px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .form-container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 450px;
    }

    .form-title {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 30px;
      text-align: center;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #1a1a1a;
      font-size: 0.95rem;
      margin-bottom: 8px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-group input:focus {
      outline: none;
      border-color: #d4af37;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    }

    .submit-btn {
      width: 100%;
      background: #d4af37;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 10px;
    }

    .submit-btn:hover {
      background: #b8941f;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    }

    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .switch-link {
      text-align: center;
      margin-top: 20px;
      font-size: 0.95rem;
    }

    .switch-link a {
      color: #DA65AC;
      text-decoration: none;
      font-weight: 600;
    }

    .alert.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      text-align: center;
      font-size: 0.95rem;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  onSubmit(): void {
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.authService.setToken(response);
        
        // Merge guest cart with user cart
        const guestCart = this.cartService.loadLocalCart();
        if (guestCart.length > 0) {
          this.cartService.mergeGuestCart(guestCart).subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error('Cart merge failed:', err);
              this.isLoading = false;
              this.router.navigate(['/']);
            }
          });
        } else {
          this.isLoading = false;
          this.cartService.getCartItems().subscribe();
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        console.error('Login error:', err);
      }
    });
  }
}