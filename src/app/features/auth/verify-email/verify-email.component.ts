import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg"><div class="bg-circle c1"></div></div>
      <div class="auth-card animate-scaleIn">
        <div class="auth-header">
          <div class="auth-icon">✉️</div>
          <h1>Verify Email</h1>
          <p>Enter the verification code sent to your email</p>
        </div>
        @if (error) { <div class="alert-error animate-fadeIn">{{ error }}</div> }
        @if (success) { <div class="alert-success animate-fadeIn">{{ success }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="you@example.com"/>
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span class="error-msg">Valid email required</span>
            }
          </div>
          <div class="form-group">
            <label>Verification Code</label>
            <input type="text" formControlName="code" placeholder="Enter code from email"/>
            @if (form.get('code')?.invalid && form.get('code')?.touched) {
              <span class="error-msg">Code is required</span>
            }
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading">
            @if (loading) { <span class="spinner-sm"></span> } Verify Email
          </button>
        </form>
        <p class="auth-switch" style="margin-top:20px">
          Didn't get it? <a (click)="resend()" style="cursor:pointer">Resend code</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: '../login/login.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', Validators.required]
  });
  loading = false; error = ''; success = '';

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.form.patchValue({ email });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.verifyEmail(this.form.value as any).subscribe({
      next: () => {
        this.success = 'Email verified! Redirecting to login...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (e) => { this.error = e.error?.message || 'Verification failed.'; this.loading = false; }
    });
  }

  resend() {
    const email = this.form.value.email;
    if (!email) { this.error = 'Enter your email first.'; return; }
    this.authService.resendEmailVerification(email).subscribe({
      next: () => { this.success = 'Code resent! Check your inbox.'; },
      error: (e) => { this.error = e.error?.message || 'Failed to resend.'; }
    });
  }
}