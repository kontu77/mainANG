import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg"><div class="bg-circle c1"></div><div class="bg-circle c2"></div></div>
      <div class="auth-card animate-scaleIn">
        <div class="auth-header">
          <div class="auth-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1>Reset Password</h1>
          <p>Set your new password</p>
        </div>
        @if (error) { <div class="alert-error">{{ error }}</div> }
        @if (success) { <div class="alert-success">{{ success }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="you@example.com"/>
          </div>
          <div class="form-group">
            <label>Reset Token</label>
            <input type="text" formControlName="token" placeholder="Token from email"/>
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" formControlName="newPassword" placeholder="Min. 6 characters"/>
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input type="password" formControlName="confirmNewPassword" placeholder="Repeat new password"/>
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading">
            @if (loading) { <span class="spinner-sm"></span> } Reset Password
          </button>
        </form>
        <p class="auth-switch" style="margin-top:20px"><a routerLink="/auth/login">← Back to login</a></p>
      </div>
    </div>
  `,
  styleUrl: '../login/login.component.scss'
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', Validators.required]
  });
  loading = false; error = ''; success = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.resetPassword(this.form.value as any).subscribe({
      next: () => {
        this.success = 'Password reset! Redirecting...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (e) => { this.error = e.error?.message || 'Reset failed.'; this.loading = false; }
    });
  }
}
