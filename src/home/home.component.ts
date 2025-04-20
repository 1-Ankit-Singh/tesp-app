import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../Model/product';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProductService } from '../product/product.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products!: Observable<Product[]>;
  newProduct: Product = { productName: '', description: '', images: [] };
  numberOfImages: number = 0;
  imageInputs: any[] = [];
  selectedFiles: File[] = [];
  imageSequences: number[] = [];
  editingProduct: Product | null = null;
  editingImageUrls: string[] = [];
  productDetails!: Product;
  showViewProductDetails: boolean = false;
  searchTerm!: string;
  categoryist: string[] = ['Sofa', 'Bedsheet', 'Foam', 'Mattress'];

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    private router: Router
  ) {
    this.products = this.productService.getProducts();
  } // Inject the service

  ngOnInit() {}

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  onSearch() {
    console.log(this.searchTerm);
  }

  viewProductDetails(product: Product) {
    this.showViewProductDetails = true;
    this.productDetails = product;
  }

  prepareImageInputs() {
    this.imageInputs = Array(this.numberOfImages).fill(null);
    this.selectedFiles = Array(this.numberOfImages).fill(null);
    this.imageSequences = Array(this.numberOfImages).map(
      (_, index) => index + 1
    ); // Default sequence
  }

  onFileSelected(index: number, event: any) {
    this.selectedFiles[index] = event.target.files[0];
  }

  async addProduct() {
    await this.productService.addProduct(
      this.newProduct,
      this.selectedFiles,
      this.imageSequences
    );
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
      await this.productService.updateProduct(
        this.editingProduct,
        this.editingImageUrls
      );
      this.editingProduct = null;
      this.editingImageUrls = [];
    }
  }

  cancelEdit() {
    this.editingProduct = null;
    this.editingImageUrls = [];
  }
}
