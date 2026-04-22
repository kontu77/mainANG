import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  LoginRequest, RegisterRequest, AdminRequest,
  AuthResponse, VerifyEmailRequest, ResetPasswordRequest
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = environment.apiUrl;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  private _isAdmin$ = new BehaviorSubject<boolean>(this.isAdminStored());
  isAdmin$ = this._isAdmin$.asObservable();

  // ---- USER AUTH ----
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, data).pipe(
      tap(res => this.saveTokens(res, false))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.api}/auth/forget-password/${email}`, {});
  }

  resendEmailVerification(email: string): Observable<any> {
    return this.http.post(`${this.api}/auth/resend-email-verification/${email}`, {});
  }

  verifyEmail(data: VerifyEmailRequest): Observable<any> {
    return this.http.put(`${this.api}/auth/verify-email`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.put(`${this.api}/auth/reset-password`, data);
  }

  // ---- ADMIN AUTH ----
  adminRegister(data: AdminRequest): Observable<any> {
    return this.http.post(`${this.api}/admin/register`, data);
  }

  adminLogin(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/admin/login`, data).pipe(
      tap(res => this.saveTokens(res, true))
    );
  }

  // ---- TOKEN MANAGEMENT ----
  saveTokens(res: AuthResponse, isAdmin: boolean): void {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('tokenType', res.tokenType || 'Bearer');
    localStorage.setItem('expiresIn', String(res.expiresIn));
    localStorage.setItem('isAdmin', String(isAdmin));
    this._isLoggedIn$.next(true);
    this._isAdmin$.next(isAdmin);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  isAdminStored(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('isAdmin');
    this._isLoggedIn$.next(false);
    this._isAdmin$.next(false);
    this.router.navigate(['/auth/login']);
  }
}
