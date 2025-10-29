import { jwtDecode } from 'jwt-decode';
import TokenRefreshService from './tokenRefresh';
import { authCookies } from './cookies';

interface DecodedToken {
  id: number;
  email: string;
  account_type: 'freelancer' | 'client';
  iat: number;
  exp: number;
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for token using cookie-based authentication
  const token = authCookies.getToken();
  if (!token || token === 'null' || token === 'undefined') return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Clear from both storages
      authCookies.removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    // Clear from both storages on decode error
    authCookies.removeToken();
    return false;
  }
};

export const getUserAccountType = (): 'freelancer' | 'client' | null => {
  if (typeof window === 'undefined') return null;
  
  const token = authCookies.getToken();
  if (!token || token === 'null' || token === 'undefined') return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.account_type;
  } catch (error) {
    return null;
  }
};

export const getUserId = (): number | null => {
  if (typeof window === 'undefined') return null;
  
  const token = authCookies.getToken();
  if (!token || token === 'null' || token === 'undefined') return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    authCookies.removeToken();
    
    // Stop automatic token refresh monitoring
    const tokenRefreshService = TokenRefreshService.getInstance();
    tokenRefreshService.clearTokens();
  }
};


