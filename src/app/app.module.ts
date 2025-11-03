import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Import dependencies needed for interceptor registration
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { GalleryComponent } from './gallery/gallery.component';
import { XboxComponent } from './xbox/xbox.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ProductOrderComponent } from './product-order/product-order.component';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './account/login/login.component';
import { SignupComponent } from './account/signup/signup.component';
import { ProfileComponent } from './account/profile/profile.component';
import { AuthInterceptor } from './auth.interceptor'; // Import the new interceptor

@NgModule({
  declarations: [
    // Empty - since all components are standalone
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Correctly imported once here
    // Add all your standalone components here:
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainBodyComponent,
    MainHeaderComponent,
    GalleryComponent,
    XboxComponent,
    ProductCategoryComponent,
    ShoppingCartComponent,
    ProductOrderComponent,
    CustomerServiceComponent,
    CompanyHomeComponent,
    ContactUsComponent,
    // New Account Components
    LoginComponent, 
    SignupComponent, 
    ProfileComponent
  ],
  providers: [
    // Correctly registers the AuthInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }