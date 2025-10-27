import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  taxRate = 0.08; // 8% tax rate

  ngOnInit(): void {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    // Sample cart items for demonstration
    this.cartItems = [
      {
        id: 1,
        name: 'Diamond Solitaire Ring',
        description: 'Classic 1-carat diamond in platinum setting',
        category: 'Rings',
        unit: 'piece',
        price: 2500.00,
        quantity: 1,
        image: 'https://via.placeholder.com/200x200/E7B1C1/FFFFFF?text=Diamond+Ring'
      },
      {
        id: 2,
        name: 'Pearl Drop Earrings',
        description: 'South Sea pearls with diamond accents',
        category: 'Earrings',
        unit: 'pair',
        price: 850.00,
        quantity: 2,
        image: 'https://via.placeholder.com/200x200/D4AF37/FFFFFF?text=Pearl+Earrings'
      },
      {
        id: 3,
        name: 'Emerald Pendant',
        description: 'Colombian emerald in 18k gold',
        category: 'Necklaces',
        unit: 'piece',
        price: 1200.00,
        quantity: 1,
        image: 'https://via.placeholder.com/200x200/F8F6F0/333333?text=Emerald+Pendant'
      }
    ];
  }

  increaseQuantity(index: number): void {
    if (this.cartItems[index].quantity < 99) {
      this.cartItems[index].quantity++;
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    }
  }

  updateQuantity(index: number, event: any): void {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity >= 1 && newQuantity <= 99) {
      this.cartItems[index].quantity = newQuantity;
    } else {
      event.target.value = this.cartItems[index].quantity;
    }
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTax(): number {
    return this.getSubtotal() * this.taxRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  proceedToCheckout(): void {
    // In a real application, this would navigate to checkout
    console.log('Proceeding to checkout with items:', this.cartItems);
    alert('Checkout functionality would be implemented here!');
  }
}
