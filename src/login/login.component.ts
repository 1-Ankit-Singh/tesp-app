import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h2>{{ isRegistering ? 'Create Account' : (isForgotPassword ? 'Reset Password' : 'Login') }}</h2>

    <div *ngIf="!isRegistering && !isForgotPassword">
      <input type="email" [(ngModel)]="loginEmail" placeholder="Email" />
      <input type="password" [(ngModel)]="loginPassword" placeholder="Password" />
      <button (click)="login()">Login</button>
      <p>
        <button type="button" href="#" (click)="isForgotPassword = true">Forgot your password?</button>
      </p>
      <p>
        Don't have an account? <button type="button" href="#" (click)="isRegistering = true">Create one</button>
      </p>
      <p *ngIf="loginError" style="color: red;">{{ loginError }}</p>
    </div>

    <div *ngIf="isRegistering">
      <input type="email" [(ngModel)]="registerEmail" placeholder="Email" />
      <input type="password" [(ngModel)]="registerPassword" placeholder="Password" />
      <button (click)="register()">Create Account</button>
      <p>
        Already have an account? <a href="#" (click)="isRegistering = false">Login</a>
      </p>
      <p *ngIf="registerMessage">{{ registerMessage }}</p>
      <p *ngIf="registerError" style="color: red;">{{ registerError }}</p>
    </div>

    <div *ngIf="isForgotPassword">
      <input type="email" [(ngModel)]="resetPasswordEmail" placeholder="Email address" />
      <button (click)="resetPassword()">Send Reset Email</button>
      <p>
        Remember your password? <a href="#" (click)="isForgotPassword = false">Log in</a>
      </p>
      <p *ngIf="resetPasswordMessage">{{ resetPasswordMessage }}</p>
      <p *ngIf="resetPasswordError" style="color: red;">{{ resetPasswordError }}</p>
    </div>
  `,
})
export class LoginComponent {
  isRegistering = false;
  isForgotPassword = false;
  loginEmail = '';
  loginPassword = '';
  loginError = '';
  registerEmail = '';
  registerPassword = '';
  registerMessage = '';
  registerError = '';
  resetPasswordEmail = '';
  resetPasswordMessage = '';
  resetPasswordError = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    this.registerError = '';
    this.registerMessage = '';
    try {
      const user = await this.authService.register(this.registerEmail, this.registerPassword);
      if (user) {
        this.registerMessage = 'Account created successfully! Please check your inbox to verify your email address.';
        this.isRegistering = false; // Go back to login
      } else {
        this.registerError = 'Failed to create account.';
      }
    } catch (error: any) {
      this.registerError = error.message;
    }
  }

  async login() {
    this.loginError = '';
    try {
      await this.authService.login(this.loginEmail, this.loginPassword);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.loginError = error.message;
    }
  }

  async resetPassword() {
    this.resetPasswordError = '';
    this.resetPasswordMessage = '';
    try {
      await this.authService.forgotPassword(this.resetPasswordEmail);
      this.resetPasswordMessage = 'Password reset email sent! Please check your inbox.';
      this.isForgotPassword = false; // Go back to login
    } catch (error: any) {
      this.resetPasswordError = error.message;
    }
  }
}