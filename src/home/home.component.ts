import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../Model/product';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProductService } from '../product/product.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CategoryService } from '../category/category.service';
import { UsersService } from '../users/users.service';
import { Category } from '../Model/category';
import { Users } from '../Model/users';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  products!: Observable<Product[]>;
  newProduct: Product = {
    productName: '',
    description: '',
    category: '',
    images: [],
  };
  numberOfImages: number = 0;
  imageInputs: any[] = [];
  selectedFiles: File[] = [];
  imageSequences: number[] = [];
  editingProduct: Product | null = null;
  editingImageUrls: string[] = [];
  productDetails!: Product;
  showViewProductDetails: boolean = false;
  searchTerm!: string;
  searchCategory: string = 'Choose';
  categoryList!: Observable<Category[]>;
  userList!: Observable<Users[]>;
  newCategory: Category = { name: '', status: true };
  newUser: Users = { emailID: '', phoneNumber: '' };
  editingCategory?: string;
  editingUser?: string;

  constructor(
    private categoryService: CategoryService,
    private userService: UsersService,
    private productService: ProductService,
    public authService: AuthService,
    private router: Router
  ) {
    this.products = this.productService.getProducts();
    this.categoryList = this.categoryService.getCategories();
  } // Inject the service

  initializeCategory() {
    this.categoryList = this.categoryService.getCategories();
  }

  initializeUser() {
    this.userList = this.userService.getUsers();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
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

  addNewCategory() {
    this.categoryService.createCategory(this.newCategory).then(() => {
      this.newCategory = { name: '', status: true };
      this.initializeCategory();
    });
  }

  editCategory(categoryID: string) {
    this.editingCategory = categoryID;
  }

  cancelEditCategory() {
    this.editingCategory = '';
  }

  updateCategory(category: Category) {
    this.categoryService.updateCategory(category.id!, category).then(() => {
      this.initializeCategory();
      this.editingCategory = '';
    });
  }

  deleteCategory(categoryID: string) {
    this.categoryService.deleteCategory(categoryID).then(() => {
      this.initializeCategory();
    });
  }

  addNewUser() {
    this.userService.createUser(this.newUser).then(() => {
      this.newUser = { emailID: '', phoneNumber: '' };
      this.initializeUser();
    });
  }

  editUser(userID: string) {
    this.editingUser = userID;
  }

  cancelEditUser() {
    this.editingUser = '';
  }

  updateUser(user: Users) {
    this.userService.updateUser(user.id!, user).then(() => {
      this.initializeUser();
      this.editingUser = '';
    });
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).then(() => {
      this.initializeUser();
    });
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
    this.newProduct = {
      productName: '',
      description: '',
      category: '',
      images: [],
    };
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
