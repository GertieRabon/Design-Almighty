// src/app/service/order.service.ts
import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTO for order creation (backend assumes the JWT provides the user_id)
interface OrderRequest {
  // In a real app, this would include selected shipping/billing address IDs, payment method, etc.
  // For now, we send minimal data, assuming the backend uses the cart and user ID.
  notes: string;
}

// DTO for order response
interface OrderResponse {
    id: number;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseHttpService{

  constructor (protected override http: HttpClient) { 
    // The base path is '/api/order'
    super(http, '/api/order') 
   }

   /**
    * Creates a new order from the authenticated user's cart.
    * The JWT Interceptor ensures the user ID is sent securely.
    */
   createOrder(notes: string = ''): Observable<OrderResponse> {
        const payload: OrderRequest = { notes };
        // BaseHttpService's update() method uses POST, which is suitable for creating a new order.
        return this.update(payload); 
   }

   /**
    * Fetches the order history for the authenticated user.
    */
   getOrderHistory(): Observable<OrderResponse[]> {
        // GET /api/order - relies on JWT for user ID
        return this.findAll(); 
   }
}