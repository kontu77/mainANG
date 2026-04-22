import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!token || !isAdmin) {
    router.navigate(['/admin/login']);
    return false;
  }
  return true;
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  if (token) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    router.navigate([isAdmin ? '/admin/dashboard' : '/products']);
    return false;
  }
  return true;
};
