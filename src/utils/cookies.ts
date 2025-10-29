import Cookies from 'js-cookie';

// Cookie options interface
export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

// Default cookie options for security
const defaultOptions: CookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

// Auth token utilities
export const authCookies = {
  // Set authentication token
  setToken: (token: string, rememberMe: boolean = false) => {
    const options: CookieOptions = {
      ...defaultOptions,
      // If remember me is true, expire in 7 days, otherwise session cookie
      ...(rememberMe && { expires: 7 })
    };
    Cookies.set('auth_token', token, options);
  },

  // Get authentication token
  getToken: (): string | undefined => {
    return Cookies.get('auth_token');
  },

  // Remove authentication token
  removeToken: () => {
    Cookies.remove('auth_token', { path: '/' });
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!Cookies.get('auth_token');
  }
};

// User preferences utilities
export const preferenceCookies = {
  // Set user preference
  set: (key: string, value: string, expires: number = 365) => {
    const options: CookieOptions = {
      ...defaultOptions,
      expires
    };
    Cookies.set(`pref_${key}`, value, options);
  },

  // Get user preference
  get: (key: string): string | undefined => {
    return Cookies.get(`pref_${key}`);
  },

  // Remove user preference
  remove: (key: string) => {
    Cookies.remove(`pref_${key}`, { path: '/' });
  },

  // Set theme preference
  setTheme: (theme: 'light' | 'dark') => {
    preferenceCookies.set('theme', theme);
  },

  // Get theme preference
  getTheme: (): 'light' | 'dark' | undefined => {
    const theme = preferenceCookies.get('theme');
    return theme === 'dark' ? 'dark' : 'light';
  },

  // Set language preference
  setLanguage: (language: string) => {
    preferenceCookies.set('language', language);
  },

  // Get language preference
  getLanguage: (): string | undefined => {
    return preferenceCookies.get('language');
  }
};

// Cookie consent utilities
export const consentCookies = {
  // Set consent preferences
  setConsent: (consent: {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  }) => {
    const options: CookieOptions = {
      ...defaultOptions,
      expires: 365 // Consent lasts 1 year
    };
    Cookies.set('cookie_consent', JSON.stringify(consent), options);
  },

  // Get consent preferences
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

  // Check if user has given consent
  hasConsent: (category?: 'essential' | 'analytics' | 'marketing' | 'preferences'): boolean => {
    const consent = consentCookies.getConsent();
    if (!consent) return false;

    if (!category) return consent.essential; // Basic consent check

    return consent[category] || false;
  },

  // Remove consent (withdraw consent)
  removeConsent: () => {
    Cookies.remove('cookie_consent', { path: '/' });
  },

  // Check if consent banner should be shown
  shouldShowBanner: (): boolean => {
    return !consentCookies.getConsent();
  }
};

// Generic cookie utilities
export const cookieUtils = {
  // Set any cookie
  set: (name: string, value: string, options?: CookieOptions) => {
    Cookies.set(name, value, { ...defaultOptions, ...options });
  },

  // Get any cookie
  get: (name: string): string | undefined => {
    return Cookies.get(name);
  },

  // Remove any cookie
  remove: (name: string, options?: { path?: string; domain?: string }) => {
    Cookies.remove(name, options || { path: '/' });
  },

  // Get all cookies
  getAll: () => {
    return Cookies.get();
  },

  // Clear all cookies (use carefully!)
  clearAll: () => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
    });
  }
};

// Export default object with all utilities
export default {
  auth: authCookies,
  preferences: preferenceCookies,
  consent: consentCookies,
  utils: cookieUtils
};