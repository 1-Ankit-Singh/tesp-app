import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Users } from '../Model/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore: Firestore = inject(Firestore); // Inject Firestore
  private usersCollection = collection(this.firestore, 'allowedUsers');

  // Create (Add) a new users
  async createUser(users: Omit<Users, 'id'>): Promise<void> {
    try {
      await addDoc(this.usersCollection, users);
    } catch (error) {
      console.error('Error adding users:', error);
      throw error; // Re-throw to allow component to handle it
    }
  }

  // Read (Get) all users
  getUsers(): Observable<Users[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<Users[]>;
  }

  // Update a users
  async updateUser(id: string, updatedCategory: Partial<Users>): Promise<void> {
    const categoryDocRef = doc(this.firestore, `allowedUsers/${id}`);
    try {
      await updateDoc(categoryDocRef, updatedCategory);
    } catch (error) {
      console.error('Error updating users:', error);
      throw error;
    }
  }

  // Delete a users
  async deleteUser(id: string): Promise<void> {
    const categoryDocRef = doc(this.firestore, `allowedUsers/${id}`);
    try {
      await deleteDoc(categoryDocRef);
    } catch (error) {
      console.error('Error deleting users:', error);
      throw error;
    }
  }
}
