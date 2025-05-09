import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { SignInRequest, SignUpRequest, SignUpResponse, JwtTokenPayload } from '../model/auth.model';
import { User, AuthState } from '../model/user.model';
import { API_ENDPOINTS, AuthUtils } from '../model/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private isBrowser: boolean;
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });
  
  authState$ = this.authStateSubject.asObservable();
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadAuthStateFromStorage();
  }
  
  private loadAuthStateFromStorage(): void {
    if (!this.isBrowser) {
      return; // Skip on server-side
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = this.decodeToken(token);
        const user: User = {
          id: decodedToken.sub,
          username: decodedToken.username,
          email: '', // Not available in token
          role: decodedToken.role,
          createdAt: new Date(decodedToken.iat * 1000).toISOString()
        };
        
        this.authStateSubject.next({
          isAuthenticated: true,
          user,
          token
        });
      } catch (error) {
        if (this.isBrowser) {
          localStorage.removeItem('token');
        }
      }
    }
  }
  
  signUp(data: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.SIGN_UP}`, data);
  }
  
  signIn(data: SignInRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.AUTH.SIGN_IN}`, data, { 
      observe: 'response',
      responseType: 'json'
    }).pipe(
      tap(response => {
        const authHeader = response.headers.get('Authorization');
        if (authHeader) {
          const token = this.extractTokenFromHeader(authHeader);
          if (token) {
            if (this.isBrowser) {
              localStorage.setItem('token', token);
            }
            
            const decodedToken = this.decodeToken(token);
            
            const user: User = {
              id: decodedToken.sub,
              username: decodedToken.username,
              email: '', // Not available in token
              role: decodedToken.role,
              createdAt: new Date(decodedToken.iat * 1000).toISOString()
            };
            
            this.authStateSubject.next({
              isAuthenticated: true,
              user,
              token
            });
          }
        }
      })
    );
  }
  
  signOut(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }
  
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }
  
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }
  
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }
  
  extractTokenFromHeader(authHeader: string): string {
    return AuthUtils.extractTokenFromHeader(authHeader);
  }
  
  decodeToken(token: string): JwtTokenPayload {
    // Simple JWT token decoder
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}