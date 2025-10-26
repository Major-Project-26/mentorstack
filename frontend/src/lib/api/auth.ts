import { BaseAPI, API_BASE_URL } from './base';
import { SignupData, LoginData, AuthResponse, UserResponse } from './types';

export class AuthAPI extends BaseAPI {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await this.handleResponse<AuthResponse>(response);
    
    // Store token in localStorage
    if (typeof window !== 'undefined' && result.token) {
      localStorage.setItem('authToken', result.token);
    }
    
    return result;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<UserResponse>(response);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
