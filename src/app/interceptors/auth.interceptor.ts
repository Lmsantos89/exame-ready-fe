import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HTTP_HEADERS, AuthUtils } from '../model/constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const authHeader = AuthUtils.createAuthHeader(token);
    const authReq = req.clone({
      headers: req.headers.set(HTTP_HEADERS.AUTHORIZATION, authHeader)
    });
    return next(authReq);
  }
  
  return next(req);
};