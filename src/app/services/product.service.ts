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
      .set('Page', page)
      .set('Take', pageSize);
    return this.http.get<ProductResponsePaged>(`${this.api}/products`, { params });
  }

  getProductById(id: number): Observable<ProductDetailedResponse> {
    return this.http.get<ProductDetailedResponse>(`${this.api}/products/${id}`);
  }

  searchProducts(query: string, page = 1, pageSize = 12): Observable<ProductResponsePaged> {
    const params = new HttpParams()
      .set('query', query)
      .set('Page', page)
      .set('Take', pageSize);
    return this.http.get<ProductResponsePaged>(`${this.api}/products/search`, { params });
  }

  filterProducts(filters: ProductFilterParams): Observable<ProductResponsePaged> {
    let params = new HttpParams()
      .set('Page', filters.pageNumber ?? 1)
      .set('Take', filters.pageSize ?? 12);
    if (filters.categoryId) params = params.set('CategoryId', filters.categoryId);
    if (filters.minPrice !== undefined && filters.minPrice !== null) params = params.set('MinPrice', filters.minPrice);
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) params = params.set('MaxPrice', filters.maxPrice);
    if (filters.minRating !== undefined && filters.minRating !== null) params = params.set('MinRating', filters.minRating);
    if (filters.sortBy) params = params.set('SortBy', filters.sortBy);
    if (filters.sortDescending !== undefined) params = params.set('SortDescending', filters.sortDescending);
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