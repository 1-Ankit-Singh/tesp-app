import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AppComponent } from './app.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from '../home/home.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // Add the phone login route
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
