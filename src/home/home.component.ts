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
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  paginatedProducts!: Product[];
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
    private categoryService: CategoryService,
    private userService: UsersService,
    private productService: ProductService,
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
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
    const products = this.productService.getProducts();
    this.productService
      .searchProducts(this.searchTerm, products)
      .subscribe((products) => {
        this.searchCategory = 'Choose';
        this.paginateProducts(this.firstPageNumber, products);
      });
  }

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

  addNewCategory() {
    this.spinner.show();
    if (!this.newCategory.name) {
      this.toastr.error('Please fill in all fields', 'Error');
      this.spinner.hide();
      return;
    }
    this.categoryService.createCategory(this.newCategory).then(() => {
      this.newCategory = { name: '', status: true };
      this.initializeCategory();
      this.toastr.success('Category added successfully', 'Success');
      this.spinner.hide();
    });
  }

  editCategory(categoryID: string) {
    this.editingCategory = categoryID;
  }

  cancelEditCategory() {
    this.editingCategory = '';
    this.initializeCategory();
  }

  updateCategory(category: Category) {
    this.spinner.show();
    if (!category.name) {
      this.toastr.error('Please fill in all fields', 'Error');
      this.spinner.hide();
      return;
    }
    this.categoryService.updateCategory(category.id!, category).then(() => {
      this.initializeCategory();
      this.toastr.success('Category updated successfully', 'Success');
      this.spinner.hide();
      this.editingCategory = '';
    });
  }

  deleteCategory(categoryID: string) {
    this.spinner.show();
    this.categoryService.deleteCategory(categoryID).then(() => {
      this.initializeCategory();
      this.toastr.success('Category deleted successfully', 'Success');
      this.spinner.hide();
    });
  }

  addNewUser() {
    this.spinner.show();
    if (!this.newUser.emailID || !this.newUser.phoneNumber) {
      this.toastr.error('Please fill in all fields', 'Error');
      this.spinner.hide();
      return;
    }
    this.userService.createUser(this.newUser).then(() => {
      this.newUser = { emailID: '', phoneNumber: '' };
      this.initializeUser();
      this.toastr.success('User added successfully', 'Success');
      this.spinner.hide();
    });
  }

  editUser(userID: string) {
    this.editingUser = userID;
  }

  cancelEditUser() {
    this.editingUser = '';
    this.initializeUser();
  }

  updateUser(user: Users) {
    this.spinner.show();
    if (!user.emailID || !user.phoneNumber) {
      this.toastr.error('Please fill in all fields', 'Error');
      this.spinner.hide();
      return;
    }
    this.userService.updateUser(user.id!, user).then(() => {
      this.initializeUser();
      this.toastr.success('User updated successfully', 'Success');
      this.spinner.hide();
      this.editingUser = '';
    });
  }

  deleteUser(userId: string) {
    this.spinner.show();
    this.userService.deleteUser(userId).then(() => {
      this.initializeUser();
      this.toastr.success('User deleted successfully', 'Success');
      this.spinner.hide();
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
    this.spinner.show();
    if (
      !this.newProduct.productName ||
      !this.newProduct.description ||
      !this.newProduct.category ||
      this.selectedFiles.length < 1
    ) {
      this.toastr.error('Please fill in all fields and select images', 'Error');
      this.spinner.hide();
      return;
    }
    var selectedFilesCount = 0;
    this.selectedFiles.forEach((file) => {
      if (file) {
        selectedFilesCount += 1;
      }
    });
    if (selectedFilesCount !== this.numberOfImages) {
      this.toastr.error('Please select the correct number of images', 'Error');
      this.spinner.hide();
      return;
    }
    if (this.selectedFiles.some((file) => !file.type.startsWith('image/'))) {
      this.toastr.error('Only image files are allowed', 'Error');
      this.spinner.hide();
      return;
    }
    await this.productService.addProduct(
      this.newProduct,
      this.selectedFiles,
      this.imageSequences
    );
    this.searchCategory = 'Choose';
    this.paginateProducts(this.firstPageNumber);

    this.toastr.success('Product added successfully', 'Success');
    this.spinner.hide();
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
    this.spinner.show();
    this.productService.deleteProduct(id);
    this.searchCategory = 'Choose';
    this.paginateProducts(this.firstPageNumber);
    this.toastr.success('Product deleted successfully', 'Success');
    this.spinner.hide();
  }

  editProduct(product: Product) {
    this.editingProduct = { ...product };
  }

  async updateProduct() {
    this.spinner.show();
    if (
      !this.editingProduct?.productName ||
      !this.editingProduct?.description ||
      !this.editingProduct?.category
    ) {
      this.toastr.error('Please fill in all fields', 'Error');
      this.spinner.hide();
      return;
    }
    if (this.editingProduct) {
      await this.productService.updateProduct(this.editingProduct);
      this.searchCategory = 'Choose';
      this.paginateProducts(this.firstPageNumber);
      this.toastr.success('Product updated successfully', 'Success');
      this.spinner.hide();
      this.editingProduct = null;
    }
  }

  cancelEdit() {
    this.editingProduct = null;
  }
}
