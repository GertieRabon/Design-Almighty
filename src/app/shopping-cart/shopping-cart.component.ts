// src/app/shopping-cart/shopping-cart.component.ts
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../service/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  taxRate = 0.08; 
  private cartSubscription!: Subscription;

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // 1. Subscribe to the cart state stream for real-time updates
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    // 2. Trigger initial load of cart items (from local storage or server)
    this.cartService.getCartItems().subscribe(); 
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // --- NEW HELPER METHOD TO FIX THE TEMPLATE ERROR ---
  getItemTotal(item: CartItem): number {
    // Safely parse the price string into a number
    return parseFloat(item.price) * item.quantity;
  }
  // --------------------------------------------------

  // --- Quantity and Item Management ---

  increaseQuantity(item: CartItem): void {
    const newQuantity = item.quantity + 1;
    if (newQuantity <= 99) {
      this.updateQuantity(item.productId, newQuantity);
    }
  }

  decreaseQuantity(item: CartItem): void {
    const newQuantity = item.quantity - 1;
    if (newQuantity >= 1) {
      this.updateQuantity(item.productId, newQuantity);
    }
  }

  onQuantityChange(item: CartItem, event: any): void {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity >= 1 && newQuantity <= 99) {
      this.updateQuantity(item.productId, newQuantity);
    } else {
      event.target.value = item.quantity;
    }
  }

  private updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateCartItem(productId, quantity).subscribe({
      error: (err) => {
        console.error('Update failed:', err);
        alert('Could not update cart item quantity.');
      }
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeCartItem(item.productId).subscribe({
      error: (err) => {
        console.error('Remove failed:', err);
        alert('Could not remove item from cart.');
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      error: (err) => {
        console.error('Clear failed:', err);
        alert('Could not clear the cart.');
      }
    });
  }

  // --- Calculations ---
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    // Use the new helper method for accurate summation
    return this.cartItems.reduce((total, item) => total + this.getItemTotal(item), 0);
  }

  getTax(): number {
    return this.getSubtotal() * this.taxRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  // --- Checkout/Routing ---

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
        return; // Cannot checkout with empty cart
    }
    
    if (!this.authService.isLoggedIn()) {
      alert('Please log in or sign up to proceed to checkout.');
      this.router.navigate(['/account/login']);
      return;
    }
    
    // Once logged in, proceed to order/checkout route
    this.router.navigate(['/order']); 
  }
}