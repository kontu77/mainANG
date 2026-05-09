import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { CartItemResponse } from '../../models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  items: CartItemResponse[] = [];
  totalPrice = 0;
  loading = true;
  updating: number | null = null;
  removing: number | null = null;
  checkingOut = false;
  success = '';
  error = '';
  private webhookUrl = 'https://kontu.app.n8n.cloud/webhook/checkout-notification';

  ngOnInit() { this.loadCart(); }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        const rawItems = data.items || [];
        this.items = rawItems.map((item: any) => ({
          id: item.id,
          productId: item.product.id,
          productName: item.product.name,
          productImageUrl: item.product.imageUrl,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice
        }));
        this.totalPrice = data.totalPrice || this.items.reduce((s, i) => s + i.totalPrice, 0);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateQuantity(item: CartItemResponse, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    this.updating = item.id;
    this.cartService.editQuantity({ itemId: item.id, quantity: newQty }).subscribe({
      next: () => {
        item.quantity = newQty;
        item.totalPrice = item.price * newQty;
        this.totalPrice = this.items.reduce((s, i) => s + i.totalPrice, 0);
        this.updating = null;
      },
      error: () => { this.updating = null; this.loadCart(); }
    });
  }

  removeItem(item: CartItemResponse) {
    this.removing = item.id;
    this.cartService.removeFromCart(item.id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== item.id);
        this.totalPrice = this.items.reduce((s, i) => s + i.totalPrice, 0);
        this.removing = null;
      },
      error: () => this.removing = null
    });
  }

  checkout() {
    this.checkingOut = true;
    this.error = '';

    const checkoutItems = [...this.items];
    const checkoutTotal = this.totalPrice;

    this.http.get<any>(`${environment.apiUrl}/users/me`).subscribe({
      next: (userRes) => {
        const user = userRes.data || userRes;

        this.cartService.checkout().subscribe({
          next: (res: any) => {
            const order = res.data || res;

            const itemsHtml = checkoutItems.map(item => `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                <tr>
                  <td style="width:80px;min-width:80px;vertical-align:middle;padding-right:20px">
                    <img src="${item.productImageUrl || ''}" width="72" height="72" style="width:72px;height:72px;border-radius:12px;object-fit:cover;display:block"/>
                  </td>
                  <td style="vertical-align:middle;padding-right:16px">
                    <div style="font-weight:600;color:#333;font-size:11px;margin-bottom:4px">${item.productName}</div>
                    <div style="color:#888;font-size:12px">რაოდენობა: ${item.quantity}</div>
                  </td>
                  <td style="vertical-align:middle;text-align:right;white-space:nowrap;width:80px">
                    <div style="color:#6c63ff;font-weight:700;font-size:15px">${item.totalPrice} ₾</div>
                  </td>
                </tr>
              </table>
              <div style="height:1px;background:#f0f0f0;margin-bottom:12px"></div>
            `).join('');

            this.http.post(this.webhookUrl, {
              userEmail: user.email,
              userName: (user.firstName || '') + ' ' + (user.lastName || ''),
              orderId: order.id || order.orderId || Date.now(),
              orderDate: new Date().toLocaleDateString('ka-GE'),
              totalPrice: checkoutTotal,
              itemsHtml
            }).subscribe();
            this.success = 'შეკვეთა წარმატებით განხორციელდა! გმადლობთ შოპინგისთვის! 🎉';
            this.items = [];
            this.totalPrice = 0;
            this.checkingOut = false;
          },
          error: (e) => {
            this.error = e.error?.message || 'Checkout failed. Please try again.';
            this.checkingOut = false;
          }
        });
      },
      error: () => {
        this.error = 'მომხმარებლის ინფო ვერ მოიძებნა.';
        this.checkingOut = false;
      }
    });
  }
}