import { Component } from '@angular/core';
import { ProductService } from './product.service';
import { Observable } from 'rxjs';
import { Product } from '../Model/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../category/category.service';
import { Category } from '../Model/category';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  searchTerm!: string;
  searchCategory: string = 'Choose';
  products!: Observable<Product[]>;
  productDetails!: Product;
  showViewProductDetails: boolean = false;
  categoryList!: Observable<Category[]>;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.products = this.productService.getProducts();
    this.categoryList = this.categoryService.getCategories();
  }

  viewProductDetails(product: Product) {
    this.showViewProductDetails = true;
    this.productDetails = product;
  }

  onSearch() {
    if (this.searchTerm) {
      this.products = this.productService.searchProducts(
        this.searchTerm,
        this.products
      );
    } else {
      this.products = this.productService.getProducts();
    }
  }

  onSearchCategory() {
    if (this.searchCategory == 'Choose') {
      this.searchCategory = '';
    }
    if (this.searchCategory) {
      this.products = this.productService.searchProductsByCategory(
        this.searchCategory,
        this.products
      );
    } else {
      this.products = this.productService.getProducts();
    }
  }
}
