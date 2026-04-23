import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const isBrowser = () => typeof window !== 'undefined';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = isBrowser() ? localStorage.getItem('accessToken') : null;
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = isBrowser() ? localStorage.getItem('accessToken') : null;
  if (!token) {
    router.navigate(['/admin/login']);
    return false;
  }
  return true;
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = isBrowser() ? localStorage.getItem('accessToken') : null;
  if (token) {
    router.navigate(['/products']);
    return false;
  }
  return true;
};