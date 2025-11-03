// src/app/service/cart.service.ts
import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // NEW

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseHttpService {
  private authService = inject(AuthService); // Inject Auth Service

  constructor(protected override http: HttpClient) { 
    super(http, '/api/cart')
  }

  // New: Fetches cart items for the currently authenticated user
  getCartItems(): Observable<any> {
    const userId = this.authService.getCurrentUser()?.userId;
    if (userId) {
      // Assuming your backend supports GET /api/cart?userId={id} or just GET /api/cart 
      // where the JWT token in the header identifies the user.
      // We will assume the latter, as it is more secure.
      return this.findAll(); 
    }
    // Handle unauthenticated state (e.g., return empty cart)
    return new Observable(observer => observer.next([])); 
  }

  // New: Adds a product to the authenticated user's cart
  addToCart(productId: number, quantity: number): Observable<any> {
    const payload = { 
      productId: productId, 
      quantity: quantity 
      // The backend should derive userId from the JWT in the header
    };
    // Assuming backend endpoint for adding is POST or PUT /api/cart
    return this.add(payload); 
  }

  // ... other cart methods (removeItem, updateQuantity) will follow a similar pattern
}