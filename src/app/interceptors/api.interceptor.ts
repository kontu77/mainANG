import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('accessToken');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';

  const headers: Record<string, string> = {
    'X-Api-Key': environment.apiKey
  };

  if (token) {
    headers['Authorization'] = `${tokenType} ${token}`;
  }

  const authReq = req.clone({ setHeaders: headers });
  return next(authReq);
};