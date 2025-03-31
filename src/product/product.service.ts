import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Product } from '../Model/product';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData,
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL, StorageReference } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsCollection;

  constructor(private firestore: Firestore, private storage: Storage, private injector: Injector) {
    this.productsCollection = collection(this.firestore, 'products');
  }

  getProducts(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }).pipe(
      map((data) => data.map((doc: any) => ({
        id: doc.id,
        productName: doc.productName,
        description: doc.description,
        images: doc.images,
      }) as Product)),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );
  }

  async addProduct(product: Product, selectedFiles: File[], imageSequences: number[]): Promise<void> {
    const sortedFiles = selectedFiles
      .map((file, index) => ({ file, sequence: imageSequences[index] }))
      .sort((a, b) => a.sequence - b.sequence)
      .map(item => item.file);

    let productDocRef = await this.runInContext(() => addDoc(this.productsCollection, product));

    const imageUrls = await Promise.all(
      sortedFiles.map(async (file) => {
        const filePath = `products/${productDocRef.id}/${file.name}`;
        const fileRef = this.runInContext(() => ref(this.storage, filePath));
        return this.uploadAndGetUrl(fileRef, file);
      })
    );

    await this.runInContext(() =>
      updateDoc(doc(this.firestore, 'products', productDocRef.id), { images: imageUrls })
    );
  }

  private async uploadAndGetUrl(fileRef: StorageReference, file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.runInContext(() => {
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          'state_changed',
          () => {},
          (error) => reject(error),
          async () => {
            try {
              const downloadURL = await this.runInContext(() => getDownloadURL(fileRef));
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });
  }

  async updateProduct(product: Product, imageUrls: string[]): Promise<void> {
    if (product.id) {
      await this.runInContext(() =>
        updateDoc(doc(this.productsCollection, product.id), {
          productName: product.productName,
          description: product.description,
          images: imageUrls,
        })
      );
    }
  }

  async deleteProduct(id: string): Promise<void> {
    await this.runInContext(() => deleteDoc(doc(this.productsCollection, id)));
  }

  private runInContext<T>(callback: () => T): T {
      return runInInjectionContext(this.injector, callback);
  }
}