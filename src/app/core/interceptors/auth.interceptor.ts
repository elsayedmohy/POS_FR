import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const accessToken = tokenService.getAccessToken();

  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject.next(null);
          return authService.refresh().pipe(
            switchMap((res: any) => {
              isRefreshing = false;

              tokenService.setTokens(res.accessToken);
              refreshSubject.next(res.accessToken);

              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.accessToken}`,
                },
                withCredentials: true,
              });

              return next(newReq);
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            }),
          );
        }

        return refreshSubject.pipe(
          filter((token) => token != null),
          take(1),
          switchMap((token) => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });
            return next(newReq);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
