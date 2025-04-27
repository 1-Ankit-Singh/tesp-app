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
import {
  Storage,
  ref,
  listAll,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsCollection;

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private injector: Injector
  ) {
    this.productsCollection = collection(this.firestore, 'products');
  }

  getProducts(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }).pipe(
      map((data) =>
        data.map(
          (doc: any) =>
            ({
              id: doc.id,
              productName: doc.productName,
              description: doc.description,
              category: doc.category,
              images: doc.images,
            } as Product)
        )
      ),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );
  }

  async addProduct(
    product: Product,
    selectedFiles: File[],
    imageSequences: number[]
  ): Promise<void> {
    const sortedFiles = selectedFiles
      .map((file, index) => ({ file, sequence: imageSequences[index] }))
      .sort((a, b) => a.sequence - b.sequence)
      .map((item) => item.file);

    let productDocRef = await this.runInContext(() =>
      addDoc(this.productsCollection, product)
    );

    const imageUrls = await Promise.all(
      sortedFiles.map(async (file) => {
        const filePath = `products/${productDocRef.id}/${file.name}`;
        const fileRef = this.runInContext(() => ref(this.storage, filePath));
        return this.uploadAndGetUrl(fileRef, file);
      })
    );

    await this.runInContext(() =>
      updateDoc(doc(this.firestore, 'products', productDocRef.id), {
        images: imageUrls,
      })
    );
  }

  private async uploadAndGetUrl(
    fileRef: StorageReference,
    file: File
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.runInContext(() => {
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          'state_changed',
          () => {},
          (error) => reject(error),
          async () => {
            try {
              const downloadURL = await this.runInContext(() =>
                getDownloadURL(fileRef)
              );
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
          category: product.category,
          images: imageUrls,
        })
      );
    }
  }

  // async deleteProduct(id: string): Promise<void> {
  //   await this.runInContext(() => deleteDoc(doc(this.productsCollection, id)));
  // }

  async deleteProduct(id: string): Promise<void> {
    try {
      // 1. Delete Firestore Document
      await this.runInContext(() =>
        deleteDoc(doc(this.productsCollection, id))
      );
      console.log(`Firestore document with ID ${id} deleted.`);

      // 2. Delete Corresponding Folder in Storage
      const storageRef = ref(this.storage, `products/${id}`);
      const listResult = await listAll(storageRef);

      // Delete all files in the folder
      const deletePromises = listResult.items.map(async (item) => {
        await deleteObject(item);
        console.log(`Storage file ${item.name} in folder ${id} deleted.`);
      });

      // Wait for all files to be deleted
      await Promise.all(deletePromises);
      console.log(`Storage folder 'products/${id}' and its contents deleted.`);
    } catch (error) {
      console.error('Error deleting product and associated storage:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Create a reference to the image file using its URL
      const storageRef = ref(this.storage, imageUrl);

      // Delete the object
      await deleteObject(storageRef);
      console.log(`Image at ${imageUrl} deleted from Storage.`);
    } catch (error) {
      console.error('Error deleting image from Storage:', error);
      throw error;
    }
  }

  private runInContext<T>(callback: () => T): T {
    return runInInjectionContext(this.injector, callback);
  }

  searchProducts(
    searchTerm: string,
    products$: Observable<Product[]>
  ): Observable<Product[]> {
    return products$.pipe(
      map((products) =>
        products.filter((product) => {
          const searchFields = [product.productName, product.description]
            .filter(Boolean)
            .join(' ')
            .toLowerCase(); // Adjust fields as needed
          const lowerSearchTerm = searchTerm.toLowerCase();
          return searchFields.includes(lowerSearchTerm);
        })
      )
    );
  }

  searchProductsByCategory(
    searchTerm: string,
    products$: Observable<Product[]>
  ): Observable<Product[]> {
    return products$.pipe(
      map((products) =>
        products.filter((product) => {
          const searchFields = [product.category]
            .filter(Boolean)
            .join(' ')
            .toLowerCase(); // Adjust fields as needed
          const lowerSearchTerm = searchTerm.toLowerCase();
          return searchFields.includes(lowerSearchTerm);
        })
      )
    );
  }
}
