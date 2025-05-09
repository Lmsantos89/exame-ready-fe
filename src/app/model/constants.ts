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