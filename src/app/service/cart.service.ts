import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, switchMap, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from '../model/product'; // Assuming this exists

// --- Cart Item Interface (Define at top or import from model file) ---
export interface CartItem {
    id?: number; 
    productId: number;
    quantity: number;
    // Product details required for display (must match ProductData entity getters)
    name: string;
    description: string;
    categoryName: string;
    price: string; 
    imageFile: string;
    unitOfMeasure: string;
}
// -------------------------------------------------------------------

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseHttpService {
  private authService = inject(AuthService);

  private readonly GUEST_CART_KEY = 'guestCart';
  
  // Central state management for the cart
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadLocalCart());
  cartItems$ = this.cartSubject.asObservable(); // Components subscribe to this

  constructor(protected override http: HttpClient) { 
    super(http, '/api/cart')
  }
  
  // Fetches cart from server (authenticated) or local storage (guest)
  getCartItems(): Observable<CartItem[]> {
    if (this.authService.isLoggedIn()) {
      // Fetch from API (Interceptor adds JWT)
      return this.findAll().pipe(
        map((dbItems: any[]) => dbItems.map(this.mapDbItemToCartItem)),
        tap(items => this.cartSubject.next(items)) // Update central state
      );
    } else {
      // Fetch from local storage
      const localCart = this.loadLocalCart();
      this.cartSubject.next(localCart);
      return of(localCart);
    }
  }

  // Adds or updates item quantity
  addToCart(product: Product, quantity: number = 1): Observable<CartItem[]> {
    const newItem: CartItem = this.mapProductToCartItem(product, quantity);
    
    if (this.authService.isLoggedIn()) {
      const payload = { productId: newItem.productId, quantity: newItem.quantity };
      
      // POST /api/cart (Backend handles upsert)
      return this.add(payload).pipe(
        switchMap(() => this.getCartItems()) // Refresh cart state from server
      );
      
    } else {
      const currentCart = this.loadLocalCart();
      const existingItem = currentCart.find(item => item.productId === newItem.productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        currentCart.push(newItem);
      }
      this.saveLocalCart(currentCart);
      this.cartSubject.next(currentCart);
      return of(currentCart);
    }
  }

  updateCartItem(productId: number, quantity: number): Observable<CartItem[]> {
    if (this.authService.isLoggedIn()) {
      const payload = { productId: productId, quantity: quantity };
      
      // PUT /api/cart for quantity update
      return this.http.put<any>(`${this.apiServerUrl}${this.path}`, payload).pipe(
        switchMap(() => this.getCartItems()) // Refresh cart state
      );
    } else {
      const currentCart = this.loadLocalCart();
      const itemToUpdate = currentCart.find(item => item.productId === productId);
      
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
        this.saveLocalCart(currentCart);
        this.cartSubject.next(currentCart);
      }
      return of(currentCart);
    }
  }

  removeCartItem(productId: number): Observable<CartItem[]> {
    if (this.authService.isLoggedIn()) {
      // DELETE /api/cart/{productId}
      const deleteUrl = `${this.apiServerUrl}${this.path}/${productId}`;
      return this.http.delete(deleteUrl).pipe(
        switchMap(() => this.getCartItems())
      );
    } else {
      const currentCart = this.loadLocalCart().filter(item => item.productId !== productId);
      this.saveLocalCart(currentCart);
      this.cartSubject.next(currentCart);
      return of(currentCart);
    }
  }

  clearCart(): Observable<any> {
    if (this.authService.isLoggedIn()) {
      // DELETE /api/cart/clear
      const clearUrl = `${this.apiServerUrl}${this.path}/clear`;
      return this.http.delete(clearUrl).pipe(
        tap(() => this.cartSubject.next([]))
      );
    } else {
      this.saveLocalCart([]);
      this.cartSubject.next([]);
      return of([]);
    }
  }

  // --- Cart Merge Logic (Called by LoginComponent) ---

  mergeGuestCart(guestItems: CartItem[]): Observable<any> {
    // POST /api/cart/merge
    const mergeUrl = `${this.apiServerUrl}${this.path}/merge`;
    
    // Convert CartItem to simple DTO (productId, quantity) for backend
    const payload = guestItems.map(item => ({ productId: item.productId, quantity: item.quantity }));

    return this.http.post(mergeUrl, payload).pipe(
      tap(() => {
        // Clear local storage cart immediately after successful server merge
        localStorage.removeItem(this.GUEST_CART_KEY);
      }),
      switchMap(() => this.getCartItems()) // Fetch and update central state
    );
  }

  // --- Local Storage Helpers ---

  loadLocalCart(): CartItem[] {
    const cartJson = localStorage.getItem(this.GUEST_CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  private saveLocalCart(items: CartItem[]): void {
    localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(items));
  }

  // Helper to map a Product object to a CartItem object for local storage
  private mapProductToCartItem(product: Product, quantity: number): CartItem {
    return {
      productId: product.id,
      quantity: quantity,
      name: product.name,
      description: product.description,
      categoryName: product.categoryName,
      price: product.price,
      imageFile: product.imageFile,
      unitOfMeasure: product.unitOfMeasure
    };
  }

  // Helper to map the server's response to the frontend CartItem interface
  private mapDbItemToCartItem(dbItem: any): CartItem {
    // Note: 'productName' comes from the transient getter 'getProductName()' in Java CartItem
    return {
        id: dbItem.id,
        productId: dbItem.productId,
        quantity: dbItem.quantity,
        name: dbItem.productName,
        description: dbItem.productDescription,
        categoryName: dbItem.productCategoryName,
        price: dbItem.productPrice,
        imageFile: dbItem.productImageFile,
        unitOfMeasure: dbItem.productUnitOfMeasure
    };
  }

  getCartSnapshot(): CartItem[] {
    // Assuming cartSubject is the BehaviorSubject internally managing the state
    // We can safely access its .value property within the service implementation.
    return this.cartSubject.value; 
  }
  
}