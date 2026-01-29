"use client";
import React, { useState, useEffect } from 'react';
import { consentCookies } from '@/utils/cookies';
import { CookieConsent, DEFAULT_CONSENT } from '@/types/cookies';
import { Cookie, Check } from 'lucide-react';

interface CookieConsentBannerProps {
  className?: string;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ className = '' }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = consentCookies.getConsent();
    if (!existingConsent) {
      setShowBanner(true);
    } else {
      setConsent(existingConsent);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent: CookieConsent = {
      ...DEFAULT_CONSENT,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: Date.now()
    };

    consentCookies.setConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    const newConsent: CookieConsent = {
      ...DEFAULT_CONSENT,
      timestamp: Date.now()
    };

    consentCookies.setConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Main Banner */}
      <div className={`cookie-consent-banner ${className}`}>
        <div className="banner-content">
          <div className="banner-header">
            <Cookie size={24} className="cookie-icon" />
            <h3>Cookies & Privacy</h3>
          </div>

          <div className="banner-body">
            <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5' }}>
              We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
              By continuing to use our site, you agree to our use of essential cookies.
            </p>

            <div className="cookie-categories">
              <div className="category essential">
                <Check size={16} />
                <span>Essential</span>
              </div>
              <div className="category optional">
                <span>Analytics</span>
              </div>
              <div className="category optional">
                <span>Marketing</span>
              </div>
              <div className="category optional">
                <span>Preferences</span>
              </div>
            </div>
          </div>

          <div className="banner-actions">
            <button
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={handleAcceptEssential}
              style={{ borderColor: '#254035', color: '#254035' }}
            >
              Essential Only
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAcceptAll}
              style={{ backgroundColor: '#254035', borderColor: '#254035' }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cookie-consent-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          padding: 1rem;
        }

        .banner-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .banner-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .cookie-icon {
          color: #254035;
        }

        .banner-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #254035;
        }

        .banner-body {
          margin-bottom: 1rem;
        }

        .banner-body p {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .cookie-categories {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .category {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .category.essential {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #dcfce7;
        }

        .category.optional {
          background: #f9fafb;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .banner-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        .banner-actions button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .btn-customize {
          background: transparent;
          color: #254035;
          border-color: #254035;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .btn-customize:hover {
          background: #f0fdf4;
          border-color: #166534;
        }

        .btn-reject {
          background: transparent;
          color: #254035;
          border-color: #254035;
        }

        .btn-reject:hover {
          background: #f0fdf4;
          border-color: #166534;
        }

        .btn-accept {
          background: #254035;
          color: white;
          border-color: #254035;
        }

        .btn-accept:hover {
          background: #1e293b;
          border-color: #1e293b;
        }

        @media (max-width: 768px) {
          .cookie-consent-banner {
            padding: 0.75rem;
          }

          .banner-actions {
            flex-direction: column;
          }

          .banner-actions button {
            width: 100%;
          }

          .cookie-categories {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default CookieConsentBanner;