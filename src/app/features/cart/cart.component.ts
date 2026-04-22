import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItemResponse } from '../../models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);

  items: CartItemResponse[] = [];
  totalPrice = 0;
  loading = true;
  updating: number | null = null;
  removing: number | null = null;
  checkingOut = false;
  success = '';
  error = '';

  ngOnInit() { this.loadCart(); }

  loadCart() {
  this.loading = true;
  this.cartService.getCart().subscribe({
    next: (res: any) => {
      const data = res.data || res;
      this.items = data.items || [];
      this.totalPrice = data.totalPrice || 0;
      this.loading = false;
    },
    error: () => this.loading = false
  });
}

  updateQuantity(item: CartItemResponse, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    this.updating = item.productId;
    this.cartService.editQuantity({ productId: item.productId, quantity: newQty }).subscribe({
      next: () => {
        item.quantity = newQty;
        item.totalPrice = item.price * newQty;
        this.totalPrice = this.items.reduce((s, i) => s + i.totalPrice, 0);
        this.updating = null;
      },
      error: () => { this.updating = null; this.loadCart(); }
    });
  }

  removeItem(productId: number) {
    this.removing = productId;
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.productId !== productId);
        this.totalPrice = this.items.reduce((s, i) => s + i.totalPrice, 0);
        this.removing = null;
      },
      error: () => this.removing = null
    });
  }

  checkout() {
    this.checkingOut = true;
    this.error = '';
    this.cartService.checkout().subscribe({
      next: () => {
        this.success = 'Order placed successfully! Thank you for your purchase! 🎉';
        this.items = [];
        this.totalPrice = 0;
        this.checkingOut = false;
      },
      error: (e) => {
        this.error = e.error?.message || 'Checkout failed. Please try again.';
        this.checkingOut = false;
      }
    });
  }
}
