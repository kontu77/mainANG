import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ProductResponse, CategoryResponse } from '../../../models/models';

@Component({
  selector: 'app-product-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-manage.component.html',
  styleUrl: './product-manage.component.scss'
})
export class ProductManageComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  products: ProductResponse[] = [];
  categories: CategoryResponse[] = [];
  loading = false;
  saving = false;
  deleting: number | null = null;
  error = '';
  success = '';
  showModal = false;
  editingProduct: ProductResponse | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;
  searchQuery = '';
  selectedCategory = '';
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', Validators.required],
    categoryId: [0, [Validators.required, Validators.min(1)]]
  });

  get f() { return this.form.controls; }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

 loadCategories() {
  this.categoryService.getCategories().subscribe({
    next: (res: any) => this.categories = res.data || res,
    error: () => {}
  });
}

  loadProducts() {
    this.loading = true;
    this.error = '';

    const doLoad = (obs: any) => {
      obs.subscribe({
       next: (res: any) => {
  this.products = res.data?.items || res.items || [];
  this.totalCount = res.data?.totalCount || res.totalCount || 0;
  this.totalPages = res.data?.totalPages || res.totalPages || 1;
  this.loading = false;
},
        error: (e: any) => {
          this.error = e.error?.message || 'Failed to load products.';
          this.loading = false;
        }
      });
    };

    if (this.searchQuery.trim()) {
      doLoad(this.productService.searchProducts(this.searchQuery, this.currentPage, this.pageSize));
    } else if (this.selectedCategory) {
      doLoad(this.productService.filterProducts({
        categoryId: +this.selectedCategory,
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      }));
    } else {
      doLoad(this.productService.getProducts(this.currentPage, this.pageSize));
    }
  }

  onSearch(e: Event) {
    this.searchQuery = (e.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadProducts();
  }

  onCategoryFilter(e: Event) {
    this.selectedCategory = (e.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.loadProducts();
  }

  openCreate() {
    this.editingProduct = null;
    this.form.reset({ price: 0, stock: 0, categoryId: 0 });
    this.showModal = true;
    this.error = '';
    this.success = '';
  }

  openEdit(product: ProductResponse) {
    this.editingProduct = product;
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId
    });
    this.showModal = true;
    this.error = '';
    this.success = '';
  }
  

  closeModal() {
    this.showModal = false;
    this.editingProduct = null;
    this.form.reset();
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';

    const data = this.form.value as any;
    const obs = this.editingProduct
      ? this.productService.updateProduct(this.editingProduct.id, data)
      : this.productService.createProduct(data);

    obs.subscribe({
      next: () => {
        this.success = this.editingProduct ? 'Product updated!' : 'Product created!';
        this.saving = false;
        this.closeModal();
        this.loadProducts();
        setTimeout(() => this.success = '', 3000);
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed to save product.';
        this.saving = false;
      }
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.deleting = id;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.deleting = null;
        this.success = 'Product deleted successfully.';
        setTimeout(() => this.success = '', 3000);
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed to delete.';
        this.deleting = null;
      }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
