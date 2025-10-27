import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../model/product';
import { ProductCategory } from '../model/product-category';
import { ProductService } from '../service/product.service';

interface JewelryCategory {
  name: string;
  description: string;
  image: string;
  count: number;
}

interface JewelryProduct {
  name: string;
  description: string;
  image: string;
  price: number;
}

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.css']
})
export class MainBodyComponent implements OnInit {
  public productsCategory: ProductCategory[] = [];
  public featuredCategories: JewelryCategory[] = [];
  public featuredProducts: JewelryProduct[] = [];

  constructor(private productService: ProductService) {
    this.initializeJewelryData();
  }

  ngOnInit(): void {
    console.log("ngOnInit called");
    this.productService.getData().subscribe(data => {
      this.productsCategory = data;
    });
  }

  private initializeJewelryData(): void {
    // Featured Categories
    this.featuredCategories = [
      {
        name: "Rings",
        description: "Exquisite engagement and wedding rings",
        image: "assets/jewelry/rings-category.jpg",
        count: 45
      },
      {
        name: "Necklaces",
        description: "Elegant pendants and statement pieces",
        image: "assets/jewelry/necklaces-category.jpg",
        count: 32
      },
      {
        name: "Earrings",
        description: "Sophisticated studs and drops",
        image: "assets/jewelry/earrings-category.jpg",
        count: 28
      },
      {
        name: "Bracelets",
        description: "Delicate chains and bangles",
        image: "assets/jewelry/bracelets-category.jpg",
        count: 21
      }
    ];

    // Featured Products
    this.featuredProducts = [
      {
        name: "Diamond Solitaire Ring",
        description: "Classic 1-carat diamond in platinum setting",
        image: "assets/jewelry/diamond-ring.jpg",
        price: 2500
      },
      {
        name: "Pearl Drop Earrings",
        description: "South Sea pearls with diamond accents",
        image: "assets/jewelry/pearl-earrings.jpg",
        price: 850
      },
      {
        name: "Emerald Pendant",
        description: "Colombian emerald in 18k gold",
        image: "assets/jewelry/emerald-pendant.jpg",
        price: 1200
      },
      {
        name: "Ruby Tennis Bracelet",
        description: "Channel-set rubies in white gold",
        image: "assets/jewelry/ruby-bracelet.jpg",
        price: 1800
      }
    ];
  }
}
