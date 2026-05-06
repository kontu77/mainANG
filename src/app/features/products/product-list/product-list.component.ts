import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { ProductResponse, CategoryResponse, ProductFilterParams } from '../../../models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  products: ProductResponse[] = [];
  categories: CategoryResponse[] = [];
  loading = false;
  cartLoading: number | null = null;
  cartSuccess: number | null = null;
  isLoggedIn = false;

  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  totalCount = 0;

  searchQuery = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minRating: number | null = null;
  sortBy = '';
  sortDescending = false;
  viewMode: 'grid' | 'list' = 'grid';

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = v);
    this.categoryService.getCategories().subscribe({ next: (res: any) => this.categories = res.data || res, error: () => {} });
    this.loadProducts();
  }

  loadProducts() {
  this.loading = true;
  this.products = [];

  if (this.searchQuery.trim()) {
    this.productService.searchProducts(this.searchQuery, this.currentPage, this.pageSize).subscribe({
      next: res => this.handleResponse(res),
      error: () => this.loading = false
    });
  } else if (this.hasFilters()) {
    const filters: ProductFilterParams = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
    if (this.selectedCategory) filters.categoryId = +this.selectedCategory;
    if (this.minPrice !== null) filters.minPrice = this.minPrice;
    if (this.maxPrice !== null) filters.maxPrice = this.maxPrice;
    if (this.minRating !== null) filters.minRating = this.minRating;
    if (this.sortBy) { filters.sortBy = this.sortBy; filters.sortDescending = this.sortDescending; }

    this.productService.filterProducts(filters).subscribe({
      next: res => this.handleResponse(res),
      error: () => this.loading = false
    });
  } else {
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: res => this.handleResponse(res),
      error: () => this.loading = false
    });
  }
}

  hasFilters(): boolean {
    return !!(this.selectedCategory || this.minPrice !== null || this.maxPrice !== null || this.minRating !== null || this.sortBy);
  }

handleResponse(res: any) {
  this.products = (res.data.items || []).map((p: any) => ({
    ...p,
    averageRating: p.rating || 0,
    reviewCount: p.reviewCount || 0
  }));
  this.totalCount = res.data.totalCount || 0;
  this.totalPages = res.data.totalPages || 1;
  this.loading = false;
}

  onSearch(e: Event) {
    this.searchQuery = (e.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadProducts();
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minRating = null;
    this.sortBy = '';
    this.sortDescending = false;
    this.currentPage = 1;
    this.loadProducts();
  }

  addToCart(product: ProductResponse) {
    if (!this.isLoggedIn) return;
    this.cartLoading = product.id;
    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.cartLoading = null;
        this.cartSuccess = product.id;
        setTimeout(() => this.cartSuccess = null, 2000);
      },
      error: () => { this.cartLoading = null; }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? '★' : '☆');
  }

  get pages(): number[] {
    const range: number[] = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++) {
      range.push(i);
    }
    return range;
  }
}
