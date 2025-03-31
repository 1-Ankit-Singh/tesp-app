import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../Model/product';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ProductService } from '../product/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    FormsModule, 
    ReactiveFormsModule, 
    NgFor, 
    NgIf, 
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  products!: Observable<Product[]>; // Change to array
  newProduct: Product = { productName: '', description: '', images: [] };
  numberOfImages: number = 0;
  imageInputs: any[] = [];
  selectedFiles: File[] = [];
  imageSequences: number[] = [];
  editingProduct: Product | null = null;
  editingImageUrls: string[] = [];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  } // Inject the service

  ngOnInit() {
    
  }

  prepareImageInputs() {
    this.imageInputs = Array(this.numberOfImages).fill(null);
    this.selectedFiles = Array(this.numberOfImages).fill(null);
    this.imageSequences = Array(this.numberOfImages).map((_, index) => index + 1); // Default sequence
  }

  onFileSelected(index: number, event: any) {
    this.selectedFiles[index] = event.target.files[0];
  }

  async addProduct() {
    await this.productService.addProduct(this.newProduct, this.selectedFiles, this.imageSequences);
    this.newProduct = { productName: '', description: '', images: [] };
    this.imageInputs = [];
    this.selectedFiles = [];
    this.imageSequences = [];
    this.numberOfImages = 0;
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id);
  }

  editProduct(product: Product) {
    this.editingProduct = { ...product };
    this.editingImageUrls = [...product.images];
  }

  async updateProduct() {
    if (this.editingProduct) {
      await this.productService.updateProduct(this.editingProduct, this.editingImageUrls);
      this.editingProduct = null;
      this.editingImageUrls = [];
    }
  }

  cancelEdit() {
    this.editingProduct = null;
    this.editingImageUrls = [];
  }
}
