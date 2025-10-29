// Cookie-related type definitions

// Cookie options interface (extends js-cookie options)
export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

// Cookie consent preferences
export interface CookieConsent {
  essential: boolean;    // Always true - required for site functionality
  analytics: boolean;    // Google Analytics, tracking pixels
  marketing: boolean;    // Marketing cookies, targeted ads
  preferences: boolean;  // Functional cookies, personalization
  timestamp: number;     // When consent was given
  version: string;       // Consent policy version
}

// User preferences that can be stored in cookies
export interface UserPreferences {
  theme?: 'light' | 'dark';
  language?: string;
  region?: string;
  notifications?: boolean;
  marketingEmails?: boolean;
}

// Authentication cookie data
export interface AuthCookieData {
  token: string;
  rememberMe: boolean;
  expiresAt?: number;
  issuedAt: number;
}

// Cookie categories for GDPR compliance
export enum CookieCategory {
  ESSENTIAL = 'essential',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  PREFERENCES = 'preferences'
}

// Cookie information for consent banner
export interface CookieInfo {
  category: CookieCategory;
  title: string;
  description: string;
  required: boolean;
  cookies: Array<{
    name: string;
    purpose: string;
    duration: string;
  }>;
}

// Default cookie consent (only essential cookies enabled)
export const DEFAULT_CONSENT: CookieConsent = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: Date.now(),
  version: '1.0'
};

// Predefined cookie information for consent banner
export const COOKIE_INFORMATION: CookieInfo[] = [
  {
    category: CookieCategory.ESSENTIAL,
    title: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
    required: true,
    cookies: [
      {
        name: 'auth_token',
        purpose: 'Keeps you logged in and secure',
        duration: 'Session or 7 days (if remember me)'
      }
    ]
  },
  {
    category: CookieCategory.ANALYTICS,
    title: 'Analytics Cookies',
    description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
    required: false,
    cookies: [
      {
        name: '_ga, _gid',
        purpose: 'Google Analytics tracking',
        duration: '2 years'
      }
    ]
  },
  {
    category: CookieCategory.MARKETING,
    title: 'Marketing Cookies',
    description: 'These cookies may be set through our site by our advertising partners to build a profile of your interests.',
    required: false,
    cookies: [
      {
        name: 'marketing_*',
        purpose: 'Targeted advertising and marketing',
        duration: '1 year'
      }
    ]
  },
  {
    category: CookieCategory.PREFERENCES,
    title: 'Preference Cookies',
    description: 'These cookies enable the website to provide enhanced functionality and personalisation.',
    required: false,
    cookies: [
      {
        name: 'pref_theme, pref_language',
        purpose: 'Remember your preferences',
        duration: '1 year'
      }
    ]
  }
];

// Type guards
export const isValidCookieConsent = (obj: any): obj is CookieConsent => {
  return (
    typeof obj === 'object' &&
    typeof obj.essential === 'boolean' &&
    typeof obj.analytics === 'boolean' &&
    typeof obj.marketing === 'boolean' &&
    typeof obj.preferences === 'boolean' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.version === 'string'
  );
};

export const isValidUserPreferences = (obj: any): obj is UserPreferences => {
  return (
    typeof obj === 'object' &&
    (obj.theme === undefined || obj.theme === 'light' || obj.theme === 'dark') &&
    (obj.language === undefined || typeof obj.language === 'string') &&
    (obj.region === undefined || typeof obj.region === 'string') &&
    (obj.notifications === undefined || typeof obj.notifications === 'boolean') &&
    (obj.marketingEmails === undefined || typeof obj.marketingEmails === 'boolean')
  );
};