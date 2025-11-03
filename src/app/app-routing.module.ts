import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainBodyComponent } from './main-body/main-body.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ProductOrderComponent } from './product-order/product-order.component';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './account/login/login.component'; // New
import { SignupComponent } from './account/signup/signup.component'; // New
import { ProfileComponent } from './account/profile/profile.component'; // New

const routes: Routes = [
  {path:'',component:MainBodyComponent}, 
  {path:'cart',component:ShoppingCartComponent}, 
  {path:'product',component:ProductCategoryComponent}, 
  {path:'order',component:ProductOrderComponent}, 
  {path:'customer',component:CustomerServiceComponent}, 
  {path:'contact',component:ContactUsComponent},
  // New Account Routes
  {path:'account/login',component:LoginComponent},
  {path:'account/signup',component:SignupComponent},
  {path:'account/profile',component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }