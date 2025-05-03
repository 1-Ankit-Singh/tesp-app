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
  paginatedProducts!: Product[];
  productDetails!: Product;
  showViewProductDetails: boolean = false;
  categoryList!: Observable<Category[]>;
  pageSize: number = 20;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];
  totalProducts: number = 0;
  currentPage: number = 1;
  pageNumbers: number[] = [];
  startIndex: number = 0;
  endIndex: number = 0;
  firstPageNumber: number = 1;
  showStartIndex: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    //this.products = this.productService.getProducts();
    this.paginateProducts(this.firstPageNumber);
    this.categoryList = this.categoryService.getCategories();
  }

  paginateProducts(pageNumber: number, products?: Product[]) {
    this.startIndex = Number(pageNumber - 1) * Number(this.pageSize);
    this.endIndex = Number(this.startIndex) + Number(this.pageSize);
    this.showStartIndex = Number(this.startIndex) + 1;
    if (products) {
      this.getPaginetedProducts(pageNumber, products);
    } else {
      this.productService.getProducts().subscribe((products) => {
        this.getPaginetedProducts(pageNumber, products);
      });
    }
  }

  getPaginetedProducts(pageNumber: number, products: Product[]) {
    this.totalProducts = products.length;
    this.pageNumbers = Array.from(
      { length: Math.ceil(this.totalProducts / this.pageSize) },
      (_, i) => i + 1
    );
    this.currentPage = pageNumber;
    this.paginatedProducts = products.slice(this.startIndex, this.endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateProducts(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.pageNumbers.length) {
      this.currentPage++;
      this.paginateProducts(this.currentPage);
    }
  }

  viewProductDetails(product: Product) {
    this.showViewProductDetails = true;
    this.productDetails = product;
  }

  // onSearch() {
  //   this.products = this.productService.getProducts();
  //   if (this.searchTerm) {
  //     this.products = this.productService.searchProducts(
  //       this.searchTerm,
  //       this.products
  //     );
  //   }
  // }

  onSearch() {
    const products = this.productService.getProducts();
    this.productService
      .searchProducts(this.searchTerm, products)
      .subscribe((products) => {
        this.searchCategory = 'Choose';
        this.paginateProducts(this.firstPageNumber, products);
      });
  }

  // onSearchCategory() {
  //   this.products = this.productService.getProducts();
  //   if (this.searchCategory) {
  //     this.products = this.productService.searchProductsByCategory(
  //       this.searchCategory === 'Choose' ? '' : this.searchCategory,
  //       this.products
  //     );
  //   }
  // }

  onSearchCategory() {
    const products = this.productService.getProducts();
    this.productService
      .searchProductsByCategory(
        this.searchCategory === 'Choose' ? '' : this.searchCategory,
        products
      )
      .subscribe((products) => {
        this.paginateProducts(this.firstPageNumber, products);
      });
  }
}
