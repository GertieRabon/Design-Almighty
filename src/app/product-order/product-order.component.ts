// src/app/product-order/product-order.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { CartService, CartItem } from '../service/cart.service';
import { OrderService } from '../service/order.service';

// Model for the data collected during checkout (unchanged)
interface CustomerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string; 
    city: string;
    province: string;
    postalCode: string;
}

@Component({
  selector: 'app-product-order',
  standalone: true,
  imports: [CommonModule, FormsModule, AsyncPipe, RouterLink], 
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css'] 
})
export class ProductOrderComponent implements OnInit {
  
  public cartService = inject(CartService); 
  private orderService = inject(OrderService);
  private router = inject(Router);

  customer: CustomerData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: ''
  };
  
  orderNotes: string = '';
  isProcessing: boolean = false;
  
  taxRate = 0.08;

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
        if (items.length === 0) {
            alert('Your cart is empty. Redirecting to products.');
            this.router.navigate(['/product']);
        }
    });
  }

  private getCartSnapshot(): CartItem[] {
    return (this.cartService as any).cartSubject.value; 
  }
  
  getItemTotal(item: CartItem): number {
    return parseFloat(item.price) * item.quantity;
  }
  getSubtotal(): number {
    return this.getCartSnapshot().reduce((total, item) => total + this.getItemTotal(item), 0);
  }
  getTax(): number {
    return this.getSubtotal() * this.taxRate;
  }
  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  // src/app/product-order/product-order.component.ts (Snippet inside placeOrder)

  placeOrder(checkoutForm: any): void {
    const currentCart = this.getCartSnapshot();
    
    if (checkoutForm.invalid || currentCart.length === 0) {
        alert('Please fill in all required fields and ensure your cart is not empty.');
        return;
    }

    this.isProcessing = true;

    // FIX: Update payload to match the new CheckoutRequest DTO structure
    const orderPayload = {
        // Customer object matches the nested CustomerData DTO
        customer: this.customer, 
        
        // Items array sent as a simplified DTO
        items: currentCart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        })),
        orderNotes: this.orderNotes,
        totalAmount: this.getTotal().toFixed(2)
    };

    this.orderService.createOrder(orderPayload).subscribe({ // <-- This sends the complex object
      next: (response: any) => {
        this.isProcessing = false;
        
        // 1. Show prompt
        alert(`Order Placed Successfully! Your Order Number is #${response.orderNumber || 'N/A'}`);
        
        // 2. Clear local storage cart
        this.cartService.clearCart().subscribe(() => {
            // 3. Redirect to homepage after cart is cleared
            this.router.navigate(['/']); 
        });
      },
      error: (err) => {
        this.isProcessing = false;
        console.error('Order placement failed:', err);
        alert(`Order placement failed! Status: ${err.status}. Check the browser console for details.`);
      }
    });
  }
}