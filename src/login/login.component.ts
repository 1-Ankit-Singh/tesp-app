import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
      const user = await this.authService.register(
        this.registerEmail,
        this.registerPassword
      );
      if (user) {
        this.registerMessage =
          'Account created successfully! Please check your inbox to verify your email address.';
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
      this.resetPasswordMessage =
        'Password reset email sent! Please check your inbox.';
      this.isForgotPassword = false; // Go back to login
    } catch (error: any) {
      this.resetPasswordError = error.message;
    }
  }
}
