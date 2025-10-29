"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { consentCookies } from '@/utils/cookies';
import { CookieConsent, DEFAULT_CONSENT } from '@/types/cookies';

interface ConsentContextType {
  consent: CookieConsent | null;
  hasConsent: (category?: string) => boolean;
  updateConsent: (newConsent: CookieConsent) => void;
  showBanner: boolean;
  dismissBanner: () => void;
  isLoading: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

interface ConsentProviderProps {
  children: ReactNode;
}

export const ConsentProvider: React.FC<ConsentProviderProps> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize consent on mount
  useEffect(() => {
    const initializeConsent = () => {
      try {
        const existingConsent = consentCookies.getConsent();

        if (existingConsent) {
          setConsent(existingConsent);
          setShowBanner(false);
        } else {
          // No existing consent, show banner
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error initializing cookie consent:', error);
        // Fallback: show banner if there's an error
        setShowBanner(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConsent();
  }, []);

  // Check if user has consent for a specific category
  const hasConsent = (category?: string): boolean => {
    if (!consent) return false;

    if (!category) {
      // General consent check - has consented to anything beyond essential
      return consent.analytics || consent.marketing || consent.preferences;
    }

    // Check specific category
    switch (category.toLowerCase()) {
      case 'essential':
        return consent.essential;
      case 'analytics':
        return consent.analytics;
      case 'marketing':
        return consent.marketing;
      case 'preferences':
        return consent.preferences;
      default:
        return false;
    }
  };

  // Update consent preferences
  const updateConsent = (newConsent: CookieConsent) => {
    try {
      consentCookies.setConsent(newConsent);
      setConsent(newConsent);
      setShowBanner(false);
    } catch (error) {
      console.error('Error updating cookie consent:', error);
    }
  };

  // Dismiss banner (for essential only)
  const dismissBanner = () => {
    setShowBanner(false);
  };

  const value: ConsentContextType = {
    consent,
    hasConsent,
    updateConsent,
    showBanner,
    dismissBanner,
    isLoading
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
};

// Hook to use consent context
export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};

// Utility hook for checking specific consent types
export const useCookieConsent = () => {
  const { hasConsent, updateConsent, consent } = useConsent();

  return {
    // Check specific consents
    hasAnalyticsConsent: () => hasConsent('analytics'),
    hasMarketingConsent: () => hasConsent('marketing'),
    hasPreferencesConsent: () => hasConsent('preferences'),
    hasEssentialConsent: () => hasConsent('essential'),

    // Update consent
    updateConsent,

    // Get current consent object
    consent,

    // Check if any non-essential consent is given
    hasAnyConsent: () => hasConsent(),

    // Accept all cookies
    acceptAll: () => {
      const allConsent: CookieConsent = {
        ...DEFAULT_CONSENT,
        analytics: true,
        marketing: true,
        preferences: true,
        timestamp: Date.now()
      };
      updateConsent(allConsent);
    },

    // Accept only essential cookies
    acceptEssentialOnly: () => {
      const essentialConsent: CookieConsent = {
        ...DEFAULT_CONSENT,
        timestamp: Date.now()
      };
      updateConsent(essentialConsent);
    }
  };
};