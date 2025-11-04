// src/app/service/order.service.ts (Update the createOrder method)

import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Simplified interfaces for the response
interface OrderResponse {
    orderNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseHttpService{

  constructor (protected override http: HttpClient) { 
    super(http, '/api/order')
   }

   /**
    * FIX TS2345: Now accepts the full payload object (type 'any') to send to the server.
    */
   createOrder(payload: any): Observable<OrderResponse> { 
        // The base class's update method uses POST, which is suitable for creating a new order.
        return this.update(payload); 
   }

   /**
    * Fetches the order history for the user (Disabled in Guest Checkout model).
    */
   getOrderHistory(): Observable<OrderResponse[]> {
        return this.findAll(); 
   }
}