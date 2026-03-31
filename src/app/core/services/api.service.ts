import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: any): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.fullUrl(url), {
        params: this.buildParams(params),
        withCredentials: true,
      } )
      .pipe(
        map((res) => res.data),
      );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(this.fullUrl(url), body, { withCredentials: true })
      .pipe(map((res) => res.data));
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(this.fullUrl(url), body, { withCredentials: true })
      .pipe(map((res) => res.data));
  }

  delete<T>(url: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(this.fullUrl(url), { withCredentials: true })
      .pipe(map((res) => res.data));
  }

  private fullUrl(url: string): string {
    return `${API_CONFIG.baseUrl}${url}`;
  }

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return httpParams;
  }
}
