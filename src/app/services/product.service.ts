import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ProductResponse, ProductDetailedResponse, ProductResponsePaged,
  CreateProductRequest, UpdateProductRequest, ProductFilterParams
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getProducts(page = 1, pageSize = 12): Observable<ProductResponsePaged> {
    const params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize', pageSize);
    return this.http.get<ProductResponsePaged>(`${this.api}/products`, { params });
  }

  getProductById(id: number): Observable<ProductDetailedResponse> {
    return this.http.get<ProductDetailedResponse>(`${this.api}/products/${id}`);
  }

  searchProducts(query: string, page = 1, pageSize = 12): Observable<ProductResponsePaged> {
    const params = new HttpParams()
      .set('query', query)
      .set('pageNumber', page)
      .set('pageSize', pageSize);
    return this.http.get<ProductResponsePaged>(`${this.api}/products/search`, { params });
  }

  filterProducts(filters: ProductFilterParams): Observable<ProductResponsePaged> {
    let params = new HttpParams();
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice);
    if (filters.minRating !== undefined) params = params.set('minRating', filters.minRating);
    if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber);
    if (filters.pageSize) params = params.set('pageSize', filters.pageSize || 12);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending);
    return this.http.get<ProductResponsePaged>(`${this.api}/products/filter`, { params });
  }

  createProduct(data: CreateProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.api}/products`, data);
  }

  updateProduct(id: number, data: UpdateProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.api}/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.api}/products/${id}`);
  }
}
