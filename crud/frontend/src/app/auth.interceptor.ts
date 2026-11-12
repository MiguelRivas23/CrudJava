import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const esLogin = req.url.includes('/api/auth/');
  const token = auth.getToken();

  // Agrega "Authorization: Bearer <token>" a todas las llamadas salvo el login
  const peticion =
    token && !esLogin ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token vencido o inválido: cierra la sesión y vuelve al login
      if (err.status === 401 && !esLogin) {
        auth.logout();
      }
      return throwError(() => err);
    })
  );
};
