'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { authCookies } from '@/utils/cookies';
import Link from 'next/link';

// Loading spinner component (inline to avoid import issues)
const Spinner = () => (
    <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <style jsx>{`
      .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
    `}</style>
    </div>
);

// Main callback content component
const CallbackContent = () => {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [statusMessage, setStatusMessage] = useState('Completing sign in...');
    const [errorMessage, setErrorMessage] = useState('');

    // Use ref to track if we've already processed the callback
    const hasProcessed = useRef(false);

    useEffect(() => {
        // Prevent double execution
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const processCallback = async () => {
            // Get parameters from URL
            const token = searchParams.get('token');
            const isNewUser = searchParams.get('isNewUser') === 'true';
            const error = searchParams.get('error');
            const message = searchParams.get('message');

            // Handle error case from backend
            if (error || !token) {
                setStatus('error');
                setErrorMessage(message || 'Authentication failed. Please try again.');
                return;
            }

            try {
                setStatusMessage('Saving your credentials...');

                // Store the token in cookies
                authCookies.setToken(token, true); // Remember OAuth users by default

                setStatusMessage('Setting up your account...');

                // Small delay to ensure token is saved
                await new Promise(resolve => setTimeout(resolve, 300));

                // NEW: Check if this is a new user - redirect to role selection
                if (isNewUser) {
                    setStatusMessage('Almost there! Let\'s set up your profile...');
                    setStatus('success');

                    // Redirect new OAuth users to role selection
                    setTimeout(() => {
                        window.location.href = '/auth/select-role';
                    }, 1000);
                    return;
                }

                // EXISTING USER: Redirect based on JWT token roles
                setStatusMessage('Welcome back! Redirecting to your dashboard...');
                setStatus('success');

                let redirectPath = '/dashboard/client-dashboard';

                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    try {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        const roles = payload.roles || [];
                        const normalizedRoles = roles.map((r: string) => r.toUpperCase());

                        if (normalizedRoles.includes('VIDEOGRAPHER') ||
                            normalizedRoles.includes('VIDEO_EDITOR') ||
                            normalizedRoles.includes('VIDEOEDITOR')) {
                            redirectPath = '/dashboard/freelancer-dashboard';
                        } else if (normalizedRoles.includes('CLIENT')) {
                            redirectPath = '/dashboard/client-dashboard';
                        } else if (normalizedRoles.length === 0) {
                            // No roles - redirect to role selection
                            redirectPath = '/auth/select-role';
                        }
                    } catch (decodeError) {
                        console.error('Failed to decode token:', decodeError);
                    }
                }

                // Use window.location.href for a full page reload
                setTimeout(() => {
                    window.location.href = redirectPath;
                }, 1000);

            } catch (err) {
                console.error('OAuth callback error:', err);
                setStatus('error');
                setErrorMessage('Failed to complete authentication. Please try again.');
            }
        };

        processCallback();
    }, []); // Empty dependency array - run only once on mount

    return (
        <div className="oauth-callback-page">
            <div className="callback-container">
                {status === 'processing' && (
                    <>
                        <div className="status-icon processing">
                            <Spinner />
                        </div>
                        <h2>Just a moment...</h2>
                        <p className="status-message">{statusMessage}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="status-icon success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h2>Welcome!</h2>
                        <p className="status-message">{statusMessage}</p>
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="status-icon error">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </div>
                        <h2>Authentication Failed</h2>
                        <p className="error-message">{errorMessage}</p>
                        <div className="action-buttons">
                            <Link href="/" className="btn-secondary">
                                Back to Home
                            </Link>
                            <Link href="/?login=true" className="btn-primary">
                                Try Again
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
        .oauth-callback-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
          padding: 20px;
        }
        
        .callback-container {
          background: white;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .status-icon {
          margin-bottom: 24px;
        }
        
        .status-icon.success {
          color: #22c55e;
        }
        
        .status-icon.error {
          color: #ef4444;
        }
        
        .status-icon.processing {
          color: #1f413a;
        }
        
        h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }
        
        .status-message {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 24px;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 16px;
          margin-bottom: 24px;
        }
        
        .progress-bar {
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 16px;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #1f413a, #2a584e);
          animation: progress 1s ease-in-out forwards;
        }
        
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
        }
        
        .btn-secondary, .btn-primary {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
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
          border: 1px solid #1f413a;
        }
        
        .btn-primary:hover {
          background: #2a584e;
        }
      `}</style>
        </div>
    );
};

// Main page component with Suspense
const OAuthCallbackPage = () => {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)'
            }}>
                <Spinner />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
};

export default OAuthCallbackPage;
