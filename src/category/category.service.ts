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
import { Category } from '../Model/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private firestore: Firestore = inject(Firestore); // Inject Firestore
  private categoriesCollection = collection(this.firestore, 'category');

  // Create (Add) a new category
  async createCategory(category: Omit<Category, 'id'>): Promise<void> {
    try {
      await addDoc(this.categoriesCollection, category);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error; // Re-throw to allow component to handle it
    }
  }

  // Read (Get) all categories
  getCategories(): Observable<Category[]> {
    return collectionData(this.categoriesCollection, {
      idField: 'id',
    }) as Observable<Category[]>;
  }

  // Update a category
  async updateCategory(
    id: string,
    updatedCategory: Partial<Category>
  ): Promise<void> {
    const categoryDocRef = doc(this.firestore, `category/${id}`);
    try {
      await updateDoc(categoryDocRef, updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    const categoryDocRef = doc(this.firestore, `category/${id}`);
    try {
      await deleteDoc(categoryDocRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}
