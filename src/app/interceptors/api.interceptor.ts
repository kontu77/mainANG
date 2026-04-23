import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

const isBrowser = () => typeof window !== 'undefined';

export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = isBrowser() ? localStorage.getItem('accessToken') : null;
  const tokenType = isBrowser() ? localStorage.getItem('tokenType') || 'Bearer' : 'Bearer';

  const headers: Record<string, string> = {
    'X-Api-Key': environment.apiKey
  };

  if (token) {
    headers['Authorization'] = `${tokenType} ${token}`;
  }

  const authReq = req.clone({ setHeaders: headers });
  return next(authReq);
};