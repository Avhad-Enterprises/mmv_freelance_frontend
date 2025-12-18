'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Error messages for different OAuth error codes
const errorMessages: Record<string, { title: string; message: string; icon: string }> = {
    'access_denied': {
        title: 'Access Denied',
        message: 'You cancelled the login or denied permission. Please try again if this was unintentional.',
        icon: '🚫'
    },
    'invalid_state': {
        title: 'Session Expired',
        message: 'Your session has expired for security reasons. Please try logging in again.',
        icon: '⏰'
    },
    'invalid_request': {
        title: 'Invalid Request',
        message: 'The authentication request was invalid. Please try again.',
        icon: '⚠️'
    },
    'server_error': {
        title: 'Server Error',
        message: 'An error occurred during authentication. Please try again later.',
        icon: '🔧'
    },
    'temporarily_unavailable': {
        title: 'Service Unavailable',
        message: 'The authentication service is temporarily unavailable. Please try again later.',
        icon: '🔄'
    },
    'invalid_grant': {
        title: 'Authorization Expired',
        message: 'The authorization code has expired. Please try logging in again.',
        icon: '🔒'
    },
    'account_suspended': {
        title: 'Account Suspended',
        message: 'Your account has been suspended. Please contact support for assistance.',
        icon: '🚫'
    },
    'account_deactivated': {
        title: 'Account Deactivated',
        message: 'Your account is deactivated. Please contact support to reactivate.',
        icon: '⚠️'
    },
    'default': {
        title: 'Authentication Failed',
        message: 'Something went wrong during authentication. Please try again.',
        icon: '❌'
    }
};

// Error content component
const ErrorContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const errorCode = searchParams.get('error') || 'default';
    const customMessage = searchParams.get('message');

    const errorInfo = errorMessages[errorCode] || errorMessages['default'];
    const displayMessage = customMessage || errorInfo.message;

    const handleTryAgain = () => {
        // Close any modals and go to home with login trigger
        window.location.href = '/?login=true';
    };

    return (
        <div className="oauth-error-page">
            <div className="error-container">
                <div className="error-icon">{errorInfo.icon}</div>
                <h1>{errorInfo.title}</h1>
                <p className="error-message">{displayMessage}</p>

                {errorCode === 'account_suspended' || errorCode === 'account_deactivated' ? (
                    <div className="action-buttons">
                        <Link href="/" className="btn-secondary">
                            Back to Home
                        </Link>
                        <Link href="/contact" className="btn-primary">
                            Contact Support
                        </Link>
                    </div>
                ) : (
                    <div className="action-buttons">
                        <Link href="/" className="btn-secondary">
                            Back to Home
                        </Link>
                        <button onClick={handleTryAgain} className="btn-primary">
                            Try Again
                        </button>
                    </div>
                )}

                <div className="help-text">
                    <p>Need help? <Link href="/contact">Contact our support team</Link></p>
                </div>
            </div>

            <style jsx>{`
        .oauth-error-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          padding: 20px;
        }
        
        .error-container {
          background: white;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .error-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }
        
        h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
        }
        
        .error-message {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        
        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn-secondary, .btn-primary {
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #e5e7eb;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: #1f413a;
          color: white;
        }
        
        .btn-primary:hover {
          background: #2a584e;
        }
        
        .help-text {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        
        .help-text p {
          color: #9ca3af;
          font-size: 14px;
        }
        
        .help-text a {
          color: #1f413a;
          text-decoration: none;
          font-weight: 500;
        }
        
        .help-text a:hover {
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
};

// Main page with Suspense for searchParams
const OAuthErrorPage = () => {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
            }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    );
};

export default OAuthErrorPage;
