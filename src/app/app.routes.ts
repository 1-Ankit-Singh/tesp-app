import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from '../home/home.component';
import { ProductComponent } from '../product/product.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'product', component: ProductComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/product', pathMatch: 'full' },
];
