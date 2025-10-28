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
  public carouselImages: string[] = [];
  public currentSlide: number = 0;

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
        name: "Watches",
        description: "Elegant timepieces for every occasion",
        image: "assets/homepage/watches_category.jpg"
      },
      {
        name: "Earrings",
        description: "Sophisticated studs and drops",
        image: "assets/homepage/earrings_category.jpg"
      },
      {
        name: "Necklaces",
        description: "Elegant pendants and statement pieces",
        image: "assets/homepage/necklaces_category.jpg"
      },
      {
        name: "Bracelets",
        description: "Delicate chains and bangles",
        image: "assets/homepage/bracelets_category.jpg"
      },
      {
        name: "Hairpins",
        description: "Beautiful hair accessories and clips",
        image: "assets/homepage/hairpins_category.jpg"
      },
      {
        name: "Keychains",
        description: "Charming and functional key accessories",
        image: "assets/homepage/keychains_category.jpg"
      }
    ];

    // Carousel Images
    this.carouselImages = [
      "assets/homepage/carousel1.jpg",
      "assets/homepage/carousel2.jpg",
      "assets/homepage/carousel3.jpg",
      "assets/homepage/carousel4.jpg"
    ];

    // Featured Products (keeping for potential future use)
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

  // Carousel Methods
  nextSlide(): void {
    if (this.currentSlide < this.carouselImages.length - 1) {
      this.currentSlide++;
    }
  }

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
  }