import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

function passwordMatch(c: AbstractControl): ValidationErrors | null {
  const pw = c.get('password')?.value;
  const cpw = c.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { mismatch: true } : null;
}

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page admin-page">
      <div class="auth-bg"><div class="bg-circle c1"></div><div class="admin-grid"></div></div>
      <div class="auth-card admin-card animate-scaleIn">
        <div class="admin-badge-top"><span>🔐 ADMIN REGISTRATION</span></div>
        <div class="auth-header">
          <div class="auth-icon admin-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1>Register Admin</h1>
          <p>Create an administrator account</p>
        </div>
        @if (error) { <div class="alert-error">{{ error }}</div> }
        @if (success) { <div class="alert-success">{{ success }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" formControlName="firstName" placeholder="Admin"/>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" formControlName="lastName" placeholder="User"/>
            </div>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="admin@example.com"/>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Min. 6 characters"/>
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" formControlName="confirmPassword" placeholder="Repeat password"/>
            @if (form.get('confirmPassword')?.touched && form.hasError('mismatch')) {
              <span class="error-msg">Passwords do not match</span>
            }
          </div>
          <div class="form-group">
            <label>Secret Key <span style="color:var(--text-light);font-weight:400">(optional)</span></label>
            <input type="text" formControlName="secretKey" placeholder="Admin secret key"/>
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg admin-btn" [disabled]="loading">
            @if (loading) { <span class="spinner-sm"></span> } Create Admin Account
          </button>
        </form>
        <p class="auth-switch" style="margin-top:20px"><a routerLink="/admin/login">Already registered? Sign in →</a></p>
      </div>
    </div>
  `,
  styleUrl: './admin-register.component.scss'
})
export class AdminRegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    secretKey: ['']
  }, { validators: passwordMatch });

  loading = false; error = ''; success = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.adminRegister(this.form.value as any).subscribe({
      next: () => {
        this.success = 'Admin account created! Redirecting to login...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/login']), 2000);
      },
      error: (e) => { this.error = e.error?.message || 'Registration failed.'; this.loading = false; }
    });
  }
}
