import { Component } from '@angular/core';
import { ProductService } from './product.service';
import { Observable } from 'rxjs';
import { Product } from '../Model/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  searchTerm!: string;
  products!: Observable<Product[]>;
  categoryist: string[] = ['Sofa', 'Bedsheet', 'Foam', 'Mattress'];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }

  onSearch() {
    console.log(this.searchTerm);
  }
}
