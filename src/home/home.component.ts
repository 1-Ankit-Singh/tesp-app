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
    this.products = this.productService.getProducts();
    if (this.searchTerm) {
      this.products = this.productService.searchProducts(
        this.searchTerm,
        this.products
      );
    }
  }

  onSearchCategory() {
    this.products = this.productService.getProducts();
    if (this.searchCategory) {
      this.products = this.productService.searchProductsByCategory(
        this.searchCategory === 'Choose' ? '' : this.searchCategory,
        this.products
      );
    }
  }

  addNewCategory() {
    if (!this.newCategory.name) {
      alert('Please fill in all fields');
      return;
    }
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
    if (!category.name) {
      alert('Please fill in all fields');
      return;
    }
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
    if (!this.newUser.emailID || !this.newUser.phoneNumber) {
      alert('Please fill in all fields');
      return;
    }
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
    if (!user.emailID || !user.phoneNumber) {
      alert('Please fill in all fields');
      return;
    }
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
    if (
      !this.newProduct.productName ||
      !this.newProduct.description ||
      !this.newProduct.category ||
      this.selectedFiles.length < 1
    ) {
      alert('Please fill in all fields and select images');
      return;
    }
    var selectedFilesCount = 0;
    this.selectedFiles.forEach((file) => {
      if (file) {
        selectedFilesCount += 1;
      }
    });
    if (selectedFilesCount !== this.numberOfImages) {
      alert('Please select the correct number of images');
      return;
    }
    if (this.selectedFiles.some((file) => !file.type.startsWith('image/'))) {
      alert('Only image files are allowed');
      return;
    }
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
  }

  async updateProduct() {
    if (
      !this.editingProduct?.productName ||
      !this.editingProduct?.description ||
      !this.editingProduct?.category
    ) {
      alert('Please fill in all fields');
      return;
    }
    if (this.editingProduct) {
      await this.productService.updateProduct(this.editingProduct);
      this.editingProduct = null;
    }
  }

  cancelEdit() {
    this.editingProduct = null;
  }
}
