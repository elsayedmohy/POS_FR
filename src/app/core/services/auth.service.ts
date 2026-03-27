import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { AuthResponse, LoginRequest, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly TOKEN_KEY = 'pos_token';
    private readonly REFRESH_KEY = 'pos_refresh';
    private readonly USER_KEY = 'pos_user';

    currentUser = signal<User | null>(this.loadUser());

    constructor(private http: HttpClient, private router: Router) { }

    login(data: LoginRequest): Observable<AuthResponse> {
        // Simulate API call — replace with real endpoint
        const mockResponse: AuthResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token',
            user: {
                id: 1,
                fullName: 'Admin User',
                email: data.email,
                role: 'admin',
                status: 'active'
            }
        };
        return of(mockResponse).pipe(
            tap(res => this.storeAuth(res))
        );
    }

    register(data: any): Observable<AuthResponse> {
        const mockResponse: AuthResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token',
            user: {
                id: 2,
                fullName: data.fullName,
                email: data.email,
                role: 'cashier',
                status: 'active'
            }
        };
        return of(mockResponse).pipe(
            tap(res => this.storeAuth(res))
        );
    }

    forgotPassword(email: string): Observable<{ success: boolean }> {
        return of({ success: true });
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isAdmin(): boolean {
        return this.currentUser()?.role === 'admin';
    }

    private storeAuth(res: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUser.set(res.user);
    }

    private loadUser(): User | null {
        const raw = localStorage.getItem(this.USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }
}
