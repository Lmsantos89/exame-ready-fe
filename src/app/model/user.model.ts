/**
 * User model interfaces
 */

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}