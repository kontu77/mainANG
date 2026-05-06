import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItemResponsePaged, AddToCartRequest, EditCartItemRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private _cartCount$ = new BehaviorSubject<number>(0);
  cartCount$ = this._cartCount$.asObservable();

  getCart(): Observable<CartItemResponsePaged> {
    return this.http.get<CartItemResponsePaged>(`${this.api}/cart`).pipe(
      tap((res: any) => {
        const data = res.data || res;
        this._cartCount$.next(data.items?.length || 0);
      })
    );
  }

  addToCart(data: AddToCartRequest): Observable<any> {
    return this.http.post(`${this.api}/cart/add-to-cart`, data).pipe(
      tap(() => this._cartCount$.next(this._cartCount$.value + 1))
    );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.api}/cart/remove-from-cart/${productId}`).pipe(
      tap(() => this._cartCount$.next(Math.max(0, this._cartCount$.value - 1)))
    );
  }

  editQuantity(data: EditCartItemRequest): Observable<any> {
    return this.http.put(`${this.api}/cart/edit-quantity`, data);
  }

  checkout(): Observable<any> {
    return this.http.post(`${this.api}/users/checkout`, {});
  }
}