/**
 * Authentication model interfaces
 */

import { Observable } from 'rxjs';

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
 * Custom HTTP response type
 */
export interface ApiResponse<T = any> {
  body?: T;
  headers: {
    [key: string]: string;
  };
  status: number;
}