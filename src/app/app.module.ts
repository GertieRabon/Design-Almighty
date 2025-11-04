import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import ALL standalone components directly
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { GalleryComponent } from './gallery/gallery.component';
import { XboxComponent } from './xbox/xbox.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { HttpClientModule } from '@angular/common/http';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ProductOrderComponent } from './product-order/product-order.component'; // CRITICAL IMPORT
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
// Removed: AuthInterceptor import and related components (LoginComponent, SignupComponent, ProfileComponent)

@NgModule({
  declarations: [
    // Empty - since all components are standalone
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    
    // List all standalone components here:
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainBodyComponent,
    MainHeaderComponent,
    GalleryComponent,
    XboxComponent,
    ProductCategoryComponent,
    ShoppingCartComponent,
    ProductOrderComponent, // CRITICAL: This fixes the TS2305 error
    CustomerServiceComponent,
    CompanyHomeComponent,
    ContactUsComponent
  ],
  providers: [
    // Providers section is now clean (Removed HTTP_INTERCEPTORS as it's not needed for Guest Checkout)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }