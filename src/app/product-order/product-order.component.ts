// src/app/product-order/product-order.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// REMOVED: import { AuthService } from '../service/auth.service'; // No longer needed
import { CartService, CartItem } from '../service/cart.service';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-product-order',
  standalone: true,
  imports: [CommonModule, FormsModule, AsyncPipe],
  templateUrl: './product-order.component.html',
  styleUrls: [] 
})
export class ProductOrderComponent implements OnInit {
  
  orderNotes: string = '';
  isProcessing: boolean = false;
  
  // Removed: private authService = inject(AuthService); 
  public cartService = inject(CartService); 
  private orderService = inject(OrderService);
  private router = inject(Router);

  ngOnInit(): void {
    // CRITICAL: All login checks are removed.

    // Check cart validity upon entering the page
    this.cartService.getCartItems().subscribe(items => {
        if (items.length === 0) {
            alert('Your cart is empty. Redirecting to products.');
            this.router.navigate(['/product']);
        }
    });
  }

  // Helper method: Assuming getCartSnapshot() was added to CartService
  // Note: If you don't have this method, you can use the asynchronous call:
  // this.cartService.cartItems$['value'] 
  private getCartSnapshot(): CartItem[] {
    return this.cartService.getCartSnapshot();
  }

  placeOrder(): void {
    // Use the synchronous snapshot to safely check the cart length
    const currentCart = this.getCartSnapshot(); 
    
    if (currentCart.length === 0) { 
        alert('Cannot place an empty order.');
        this.router.navigate(['/product']);
        return;
    }

    this.isProcessing = true;
    
    // NOTE: The backend now expects the entire customer/order data in the request body.
    // In a full implementation, you would merge 'this.customer' (from a form) and 'currentCart' here.
    
    // For now, we call createOrder with mock data (or just notes) and trust the backend stub.
    this.orderService.createOrder(this.orderNotes).subscribe({
      next: (response) => {
        this.isProcessing = false;
        
        // Clear local storage cart after successful order creation
        this.cartService.clearCart().subscribe(); 
        
        alert(`Order Placed Successfully! Order #${response.orderNumber}`);
        // Redirect to a final confirmation page (or the home page)
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isProcessing = false;
        console.error('Order placement failed:', err);
        alert(`Failed to place order. Please check console for details.`);
      }
    });
  }
}