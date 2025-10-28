import { jwtDecode } from 'jwt-decode';
import TokenRefreshService from './tokenRefresh';

interface DecodedToken {
  id: number;
  email: string;
  account_type: 'freelancer' | 'client';
  iat: number;
  exp: number;
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check both localStorage and sessionStorage for token
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Clear from both storages
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    // Clear from both storages on decode error
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    return false;
  }
};

export const getUserAccountType = (): 'freelancer' | 'client' | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Stop automatic token refresh monitoring
    const tokenRefreshService = TokenRefreshService.getInstance();
    tokenRefreshService.clearTokens();
  }
};


