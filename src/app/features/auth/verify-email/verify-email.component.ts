import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg"><div class="bg-circle c1"></div></div>
      <div class="auth-card animate-scaleIn">
        <div class="auth-header">
          <div class="auth-icon">✉️</div>
          <h1>Verify Email</h1>
          <p>Enter your email and verification token</p>
        </div>
        @if (error) { <div class="alert-error">{{ error }}</div> }
        @if (success) { <div class="alert-success">{{ success }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="you@example.com"/>
          </div>
          <div class="form-group">
            <label>Verification Token</label>
            <input type="text" formControlName="token" placeholder="Enter token from email"/>
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading">
            @if (loading) { <span class="spinner-sm"></span> } Verify Email
          </button>
        </form>
        <p class="auth-switch" style="margin-top:20px">
          Didn't get it? <a routerLink="/auth/login">Resend from login</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: '../login/login.component.scss'
})
export class VerifyEmailComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', Validators.required]
  });
  loading = false; error = ''; success = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.verifyEmail(this.form.value as any).subscribe({
      next: () => { this.success = 'Email verified successfully!'; this.loading = false; },
      error: (e) => { this.error = e.error?.message || 'Verification failed.'; this.loading = false; }
    });
  }
}
