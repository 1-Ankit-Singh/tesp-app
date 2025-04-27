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
  loginPhoneNumber = '';
  loginError = '';
  registerEmail = '';
  registerPassword = '';
  registerPhoneNumber = '';
  registerMessage = '';
  registerError = '';
  resetPasswordEmail = '';
  resetPhoneNumber = '';
  resetPasswordMessage = '';
  resetPasswordError = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    this.registerError = '';
    this.registerMessage = '';
    this.registerEmail = this.registerEmail.trim();
    this.registerPassword = this.registerPassword.trim();
    this.registerPhoneNumber = this.registerPhoneNumber.trim();
    if (
      !this.registerEmail ||
      !this.registerPassword ||
      !this.registerPhoneNumber
    ) {
      this.registerError = 'Email, Phone Number and password are required.';
      return;
    }
    if (
      !(await this.checkAllowedUser(
        this.registerEmail,
        this.registerPhoneNumber
      ))
    ) {
      this.registerError = 'Invalid Details.';
      return;
    }
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

  async checkAllowedUser(
    emailID: string,
    phoneNumber: string
  ): Promise<boolean> {
    return await this.authService.checkAllowedUser(emailID, phoneNumber);
  }

  async login() {
    this.loginError = '';
    this.loginEmail = this.loginEmail.trim();
    this.loginPassword = this.loginPassword.trim();
    this.loginPhoneNumber = this.loginPhoneNumber.trim();
    if (!this.loginEmail || !this.loginPassword || !this.loginPhoneNumber) {
      this.loginError = 'Email, Phone Number and Password are required.';
      return;
    }
    if (
      !(await this.checkAllowedUser(this.loginEmail, this.loginPhoneNumber))
    ) {
      this.loginError = 'Invalid Details.';
      return;
    }
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
    this.resetPasswordEmail = this.resetPasswordEmail.trim();
    this.resetPhoneNumber = this.resetPhoneNumber.trim();
    if (!this.resetPasswordEmail || !this.resetPhoneNumber) {
      this.resetPasswordError = 'Email and Phone Number are required.';
      return;
    }
    if (
      !(await this.checkAllowedUser(
        this.resetPasswordEmail,
        this.resetPhoneNumber
      ))
    ) {
      this.resetPasswordError = 'Invalid Details.';
      return;
    }
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
