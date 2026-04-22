import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg"><div class="bg-circle c1"></div><div class="bg-circle c2"></div></div>
      <div class="auth-card animate-scaleIn">
        <div class="auth-header">
          <div class="auth-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1>Forgot Password?</h1>
          <p>Enter your email and we'll send a reset link</p>
        </div>
        @if (error) { <div class="alert-error animate-fadeIn">{{ error }}</div> }
        @if (success) { <div class="alert-success animate-fadeIn">{{ success }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email address</label>
            <input type="email" formControlName="email" placeholder="you@example.com"/>
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span class="error-msg">Valid email required</span>
            }
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading">
            @if (loading) { <span class="spinner-sm"></span> } Send Reset Link
          </button>
        </form>
        <p class="auth-switch" style="margin-top:20px"><a routerLink="/auth/login">← Back to login</a></p>
      </div>
    </div>
  `,
  styleUrl: '../login/login.component.scss'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  loading = false; error = ''; success = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.forgotPassword(this.form.value.email!).subscribe({
      next: () => { this.success = 'Reset link sent! Check your inbox.'; this.loading = false; },
      error: (e) => { this.error = e.error?.message || 'Failed to send reset link.'; this.loading = false; }
    });
  }
}
