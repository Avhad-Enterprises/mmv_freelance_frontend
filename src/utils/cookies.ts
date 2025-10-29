import Cookies from 'js-cookie';

// Cookie options interface
interface CookieOptions {
  expires?: number | Date;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Default cookie options for security
const defaultOptions: CookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

// Simplified auth token utilities
export const authCookies = {
  // Set authentication token
  setToken: (token: string, rememberMe: boolean = false) => {
    // Clear any existing tokens from localStorage/sessionStorage for migration
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }

    const options: CookieOptions = {
      ...defaultOptions,
      // If remember me is true, expire in 7 days, otherwise session cookie
      ...(rememberMe && { expires: 7 })
    };
    Cookies.set('auth_token', token, options);
  },

  // Get authentication token from cookies only
  getToken: (): string | undefined => {
    return Cookies.get('auth_token');
  },

  // Remove authentication token
  removeToken: () => {
    Cookies.remove('auth_token', { path: '/' });
    // Also clear from localStorage/sessionStorage for cleanup
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authCookies.getToken();
  }
};

// Minimal consent cookies for backward compatibility (can be removed if consent feature is unused)
export const consentCookies = {
  setConsent: (consent: any) => {
    Cookies.set('cookie_consent', JSON.stringify(consent), { ...defaultOptions, expires: 365 });
  },
  getConsent: () => {
    const consent = Cookies.get('cookie_consent');
    if (consent) {
      try {
        return JSON.parse(consent);
      } catch {
        return null;
      }
    }
    return null;
  },
  hasConsent: (category?: string): boolean => {
    const consent = consentCookies.getConsent();
    if (!consent) return false;
    if (!category) return consent.essential;
    return consent[category] || false;
  },
  removeConsent: () => {
    Cookies.remove('cookie_consent', { path: '/' });
  },
  shouldShowBanner: (): boolean => {
    return !consentCookies.getConsent();
  }
};

// Export default for backward compatibility
export default {
  auth: authCookies
};

// Utility function to get auth token (for easy importing)
export const getAuthToken = () => authCookies.getToken();