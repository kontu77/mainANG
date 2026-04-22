import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReviewResponsePaged, CreateReviewRequest, EditReviewRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getReviews(productId: number, page = 1, pageSize = 10): Observable<ReviewResponsePaged> {
    const params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize', pageSize);
    return this.http.get<ReviewResponsePaged>(`${this.api}/reviews/${productId}`, { params });
  }

  createReview(data: CreateReviewRequest): Observable<any> {
    return this.http.post(`${this.api}/reviews`, data);
  }

  editReview(data: EditReviewRequest): Observable<any> {
    return this.http.put(`${this.api}/reviews`, data);
  }

  deleteReview(productId: number): Observable<any> {
    return this.http.delete(`${this.api}/reviews/${productId}`);
  }
}
