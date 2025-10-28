import { jwtDecode } from 'jwt-decode';
import { makePostRequest } from './api';

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
  private refreshTimer: NodeJS.Timeout | null = null;
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
  private readonly WARNING_THRESHOLD = 10 * 60 * 1000; // 10 minutes before expiry

  static getInstance(): TokenRefreshService {
    if (!TokenRefreshService.instance) {
      TokenRefreshService.instance = new TokenRefreshService();
    }
    return TokenRefreshService.instance;
  }

  /**
   * Check if token needs refresh
   */
  shouldRefreshToken(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now();
      const expiryTime = decoded.exp * 1000;
      const timeUntilExpiry = expiryTime - currentTime;

      return timeUntilExpiry <= this.REFRESH_THRESHOLD;
    } catch (error) {
      console.error('Error checking token refresh need:', error);
      return false;
    }
  }

  /**
   * Check if token expiry warning should be shown
   */
  shouldShowExpiryWarning(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now();
      const expiryTime = decoded.exp * 1000;
      const timeUntilExpiry = expiryTime - currentTime;

      return timeUntilExpiry <= this.WARNING_THRESHOLD && timeUntilExpiry > 0;
    } catch (error) {
      console.error('Error checking token expiry warning:', error);
      return false;
    }
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry(token: string): number {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now();
      const expiryTime = decoded.exp * 1000;
      return Math.max(0, expiryTime - currentTime);
    } catch (error) {
      console.error('Error getting token expiry time:', error);
      return 0;
    }
  }

  /**
   * Refresh the token by re-authenticating with stored credentials
   * Note: This is a workaround until backend supports refresh tokens
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
      // For now, we'll try to refresh by making a request to a "refresh" endpoint
      // If the backend doesn't support it yet, this will fail gracefully
      console.log('Attempting to refresh token...');

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
          console.log('Token refreshed successfully');
          return newToken;
        }
      }

      // If refresh endpoint doesn't exist or fails, try alternative approach
      // For now, we'll throw an error to indicate refresh is needed
      throw new Error('Token refresh not available');

    } catch (error) {
      console.warn('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Start automatic token refresh monitoring
   */
  startAutoRefresh(): void {
    this.stopAutoRefresh(); // Clear any existing timer

    const token = this.getCurrentToken();
    if (!token) return;

    const timeUntilRefresh = this.getTimeUntilExpiry(token) - this.REFRESH_THRESHOLD;

    if (timeUntilRefresh > 0) {
      console.log(`Scheduling token refresh in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);
      this.refreshTimer = setTimeout(async () => {
        try {
          await this.refreshToken();
          // Restart monitoring with new token
          this.startAutoRefresh();
        } catch (error) {
          console.warn('Auto token refresh failed:', error);
          // Token refresh failed, user will need to login again
        }
      }, timeUntilRefresh);
    }
  }

  /**
   * Stop automatic token refresh monitoring
   */
  stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Get current token from storage
   */
  private getCurrentToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /**
   * Store token in appropriate storage
   */
  private storeToken(token: string): void {
    if (typeof window === 'undefined') return;

    // Check if token was originally in sessionStorage (session-only login)
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
      sessionStorage.setItem('token', token);
    } else {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Clear stored tokens
   */
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
    this.stopAutoRefresh();
  }
}

export default TokenRefreshService;