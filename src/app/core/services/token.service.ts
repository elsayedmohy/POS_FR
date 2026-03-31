import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private ACCESS = 'access_token';

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS);
  }



  setTokens(access: string) {
    localStorage.setItem(this.ACCESS, access);
  }

  clear() {
    localStorage.removeItem(this.ACCESS);
  }
}
