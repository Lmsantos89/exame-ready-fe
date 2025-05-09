/**
 * Authentication API Definitions for Spring WebFlux backend
 */

import { Observable } from 'rxjs';

// Request and response types for authentication endpoints

/**
 * User registration request payload
 */
export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
}

/**
 * User registration response payload
 */
export interface SignUpResponse {
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

/**
 * User login request payload
 */
export interface SignInRequest {
  username: string;
  password: string;
}

/**
 * JWT token structure (decoded)
 */
export interface JwtTokenPayload {
  sub: string;      // User ID
  username: string;
  role: string;
  iat: number;      // Issued at timestamp
  exp: number;      // Expiration timestamp
}

/**
 * HTTP response with headers
 */
export interface HttpResponse<T = any> {
  body?: T;
  headers: {
    [key: string]: string;
  };
  status: number;
}

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: '/api/auth/sign-up',
    SIGN_IN: '/api/auth/sign-in',
  },
} as const;

/**
 * User roles
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

/**
 * Authentication service interface for Spring WebFlux API
 */
export interface AuthService {
  /**
   * Register a new user
   * @param data User registration data
   * @returns Observable with sign up response
   */
  signUp(data: SignUpRequest): Observable<SignUpResponse>;
  
  /**
   * Login an existing user
   * @param data User login credentials
   * @returns Observable with HTTP response containing JWT token in Authorization header
   */
  signIn(data: SignInRequest): Observable<HttpResponse>;
  
  /**
   * Extract JWT token from Authorization header
   * @param authHeader Authorization header value (Bearer token)
   * @returns JWT token string
   */
  extractTokenFromHeader(authHeader: string): string;
  
  /**
   * Decode JWT token
   * @param token JWT token string
   * @returns Decoded token payload
   */
  decodeToken(token: string): JwtTokenPayload;
}

/**
 * Constants for HTTP headers
 */
export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
} as const;

/**
 * Helper functions for authentication
 */
export const AuthUtils = {
  /**
   * Extract token from Authorization header
   * @param authHeader Authorization header value (Bearer token)
   * @returns JWT token string without 'Bearer ' prefix
   */
  extractTokenFromHeader: (authHeader: string): string => {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return '';
  },
  
  /**
   * Create Authorization header value with token
   * @param token JWT token
   * @returns Authorization header value with Bearer prefix
   */
  createAuthHeader: (token: string): string => {
    return `Bearer ${token}`;
  }
};