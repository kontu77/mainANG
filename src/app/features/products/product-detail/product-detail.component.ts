import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { ProductDetailedResponse, ReviewResponse } from '../../../models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  product: ProductDetailedResponse | null = null;
  reviews: ReviewResponse[] = [];
  loading = true;
  cartLoading = false;
  cartSuccess = false;
  isLoggedIn = false;
  quantity = 1;
  activeTab: 'description' | 'reviews' = 'description';
  editingReview: ReviewResponse | null = null;
  reviewSaving = false;
  reviewError = '';
  reviewSuccess = '';

  reviewForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = v);
    const id = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductById(id).subscribe({
      next: (res: any) => {
        const p = res?.data ?? res;
        this.product = {
          ...p,
          averageRating: p.rating ?? 0,
          reviewCount: p.reviewCount ?? 0,
          categoryName: p.category?.name ?? ''
        };
        this.loading = false;
        this.loadReviews(id);
      },
      error: () => this.loading = false
    });
  }

  loadReviews(id: number) {
    this.reviewService.getReviews(id).subscribe({
      next: (r: any) => {
        const d = r?.data ?? r;
        this.reviews = d?.items ?? d ?? [];
      },
      error: () => {}
    });
  }

  addToCart() {
    if (!this.product || !this.isLoggedIn) return;
    this.cartLoading = true;
    this.cartService.addToCart({ productId: this.product.id, quantity: this.quantity }).subscribe({
      next: () => {
        this.cartLoading = false;
        this.cartSuccess = true;
        setTimeout(() => this.cartSuccess = false, 3000);
      },
      error: () => this.cartLoading = false
    });
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.product) return;

    this.reviewSaving = true;
    this.reviewError = '';
    const data = this.reviewForm.value;

    const obs = this.editingReview
      ? this.reviewService.editReview({ reviewId: this.editingReview.id, rate: data.rating!, comment: data.comment! })
      : this.reviewService.createReview({ productId: this.product.id, rate: data.rating!, comment: data.comment! });

    obs.subscribe({
      next: () => {
        this.reviewSuccess = this.editingReview ? 'Review updated!' : 'Review posted!';
        this.reviewSaving = false;
        this.editingReview = null;
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.loadReviews(this.product!.id);
        setTimeout(() => this.reviewSuccess = '', 3000);
      },
      error: (e) => {
        this.reviewError = e.error?.detail || e.error?.message || 'Failed to submit review.';
        this.reviewSaving = false;
      }
    });
  }

  startEditReview(review: ReviewResponse) {
    this.editingReview = review;
    this.reviewForm.patchValue({ rating: review.rating, comment: review.comment });
    this.activeTab = 'reviews';
    window.scrollTo({ top: 600, behavior: 'smooth' });
  }

  deleteReview(reviewId: number) {
    if (!confirm('Delete this review?')) return;
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.reviewSuccess = 'Review deleted.';
        setTimeout(() => this.reviewSuccess = '', 2000);
      },
      error: (e) => this.reviewError = e.error?.message || 'Delete failed.'
    });
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  setRating(r: number) { this.reviewForm.patchValue({ rating: r }); }
}