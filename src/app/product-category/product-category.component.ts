import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../model/product';
import { ProductCategory } from '../model/product-category';
import { ProductService } from '../service/product.service';
import { RouterLink } from '@angular/router';
import { CartService } from '../service/cart.service'; 
import { Router } from '@angular/router'; // Also injecting Router as a common dependency for components

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})

export class ProductCategoryComponent implements OnInit  {
    public productsCategory: ProductCategory[]  = [];

    // Use inject() for dependency injection
    private productService = inject(ProductService);
    private cartService = inject(CartService); // Injected CartService
    private router = inject(Router); // Injected Router

    constructor() {} // Empty constructor is fine when using inject()

    ngOnInit(): void {
      console.log("ngOnInit called");
      // Load product categories and products
      this.productService.getData().subscribe(data => {this.productsCategory = data; });
    }
    
    /**
     * Adds the selected product to the cart (server if authenticated, localStorage if guest).
     */
    addToCart(product: Product, event: Event): void {
        event.preventDefault(); 
        
        this.cartService.addToCart(product, 1).subscribe({
            next: () => {
                alert(`${product.name} added to cart!`); 
            },
            error: (err) => {
                console.error('Error adding to cart:', err);
                // Provide better feedback for 403 error
                if (err.status === 403 || err.status === 401) {
                    alert('Session expired. Please log in again.');
                    this.router.navigate(['/account/login']);
                } else {
                    alert(`Error adding ${product.name} to cart.`); 
                }
            }
        });
    }
}