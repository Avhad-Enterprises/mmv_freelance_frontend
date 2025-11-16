import { jwtDecode } from 'jwt-decode';
import { authCookies } from './cookies';

interface DecodedToken {
  id: number;
  email: string;
  account_type: 'freelancer' | 'client';
  iat: number;
  exp: number;
  roles?: string[];
  role?: string;
}

interface TokenRefreshResponse {
  data: {
    token: string;
  };
}

class TokenRefreshService {
  private static instance: TokenRefreshService;
  private refreshPromise: Promise<string> | null = null;

  static getInstance(): TokenRefreshService {
    if (!TokenRefreshService.instance) {
      TokenRefreshService.instance = new TokenRefreshService();
    }
    return TokenRefreshService.instance;
  }

  /**
   * Refresh the token by calling refresh endpoint
   */
  async refreshToken(): Promise<string> {
    // If a refresh is already in progress, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getCurrentToken()}`
        }
      });

      if (response.ok) {
        const data: TokenRefreshResponse = await response.json();
        const newToken = data.data.token;

        if (newToken) {
          this.storeToken(newToken);
          return newToken;
        }
      }

      throw new Error('Token refresh not available');

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current token from storage
   */
  private getCurrentToken(): string | null {
    if (typeof window === 'undefined') return null;
    return authCookies.getToken() || null;
  }

  /**
   * Store token in appropriate storage
   */
  private storeToken(token: string): void {
    if (typeof window === 'undefined') return;
    authCookies.setToken(token, false); // false = session cookie
  }

  /**
   * Clear stored tokens
   */
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      authCookies.removeToken();
    }
  }
}

export default TokenRefreshService;