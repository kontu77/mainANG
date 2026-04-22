import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);

  totalProducts = 0;
  totalCategories = 0;
  adminName = '';
  recentProducts: any[] = [];
  categories: any[] = [];
  loading = true;

  ngOnInit() {
    this.userService.getMe().subscribe({
      next: (u) => this.adminName = u.firstName + ' ' + u.lastName,
      error: () => {}
    });

    this.categoryService.getCategories().subscribe({
  next: (res: any) => {
    this.categories = res.data || res;
    this.totalCategories = this.categories.length;
  },
  error: () => {}
});

this.productService.getProducts(1, 6).subscribe({
  next: (res: any) => {
    const data = res.data || res;
    this.totalProducts = data.totalCount;
    this.recentProducts = data.items || [];
    this.loading = false;
  },
  error: () => { this.loading = false; }
});
  }
}
