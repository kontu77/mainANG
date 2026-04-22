import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { UserDetailsResponse } from '../../../models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  user: UserDetailsResponse | null = null;
  loading = true;
  activeTab: 'profile' | 'password' | 'danger' = 'profile';

  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', Validators.required]
  });

  profileSaving = false;
  profileSuccess = '';
  profileError = '';
  passwordSaving = false;
  passwordSuccess = '';
  passwordError = '';
  deleting = false;

  ngOnInit() {
   this.userService.getMe().subscribe({
  next: (res: any) => {
    const u = res.data || res;
    this.user = u;
    this.profileForm.patchValue({ firstName: u.firstName, lastName: u.lastName, email: u.email });
    this.loading = false;
  },
  error: () => this.loading = false
});
  }

  saveProfile() {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.profileSaving = true;
    this.profileError = '';
    this.userService.editProfile(this.profileForm.value as any).subscribe({
      next: () => {
        this.profileSuccess = 'Profile updated successfully!';
        this.profileSaving = false;
        setTimeout(() => this.profileSuccess = '', 3000);
      },
      error: (e) => {
        this.profileError = e.error?.message || 'Update failed.';
        this.profileSaving = false;
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    const v = this.passwordForm.value;
    if (v.newPassword !== v.confirmNewPassword) {
      this.passwordError = 'Passwords do not match.';
      return;
    }
    this.passwordSaving = true;
    this.passwordError = '';
    this.userService.changePassword(this.passwordForm.value as any).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully!';
        this.passwordSaving = false;
        this.passwordForm.reset();
        setTimeout(() => this.passwordSuccess = '', 3000);
      },
      error: (e) => {
        this.passwordError = e.error?.message || 'Password change failed.';
        this.passwordSaving = false;
      }
    });
  }

  deleteAccount() {
    if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;
    this.deleting = true;
    this.userService.deleteProfile().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      },
      error: () => { this.deleting = false; }
    });
  }

  logout() { this.authService.logout(); }
}
