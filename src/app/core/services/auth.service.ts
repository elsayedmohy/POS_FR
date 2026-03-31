import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { AuthResponse, LoginRequest, User } from '../models/models';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'pos_token';
  private readonly USER_KEY = 'pos_user';
  private readonly AUTH_URL = 'auth/';

  currentUser = signal<User | null>(this.loadUser());

  constructor(
    private apiService : ApiService,
    private tokenService : TokenService,
    private router: Router,
  ) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse>(this.AUTH_URL + 'login', data)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  register(data: any): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse>(this.AUTH_URL + 'register', data)
  }

  forgotPassword(email: string): Observable<{ success: boolean }> {
    return of({ success: true });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  refresh(): Observable<any> {
    return this.apiService.post('/refresh', {} );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private storeAuth(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
