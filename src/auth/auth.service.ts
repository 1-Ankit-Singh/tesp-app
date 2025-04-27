import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  authState,
  User,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  async register(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        await sendEmailVerification(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user && user.emailVerified) {
        return user;
      } else if (user && !user.emailVerified) {
        throw new Error(
          'Email address is not verified. Please check your inbox.'
        );
      } else {
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getAuthState(): Observable<User | null> {
    return authState(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async sendVerificationEmail(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
      }
    } else {
      console.warn('No user is currently logged in.');
    }
  }

  async checkAllowedUser(
    emailID: string,
    phoneNumber: string
  ): Promise<boolean> {
    const db = getFirestore();
    const allowedUsersCollectionRef = collection(db, 'allowedUsers');
    const q = query(
      allowedUsersCollectionRef,
      where('emailID', '==', emailID),
      where('phoneNumber', '==', phoneNumber)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return true;
    } else {
      return false;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }
}
