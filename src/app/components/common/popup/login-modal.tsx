'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/app/components/forms/login-form';
import SocialLoginButton from '@/app/components/common/social-login-button';
import { initiateOAuthLogin, getAvailableProviders, OAuthProvider } from '@/utils/oauth';
import google from '@/assets/images/icon/google.png';
import facebook from '@/assets/images/icon/facebook.png';
import apple from '@/assets/images/icon/apple.png';
import { useUser } from '@/context/UserContext';

interface LoginModalProps {
  onLoginSuccess?: () => void;
}

// Provider enabled status type
interface ProviderStatus {
  google: boolean;
  facebook: boolean;
  apple: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess = () => { } }) => {
  const { refreshUserData } = useUser();
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>({
    google: true, // Default to true for Google
    facebook: false,
    apple: false,
  });

  // Fetch provider status from API
  useEffect(() => {
    const fetchProviderStatus = async () => {
      try {
        const providers = await getAvailableProviders();
        const status: ProviderStatus = {
          google: providers.find(p => p.name === 'google')?.enabled ?? true,
          facebook: providers.find(p => p.name === 'facebook')?.enabled ?? false,
          apple: providers.find(p => p.name === 'apple')?.enabled ?? false,
        };
        setProviderStatus(status);
      } catch (error) {
        console.error('Failed to fetch provider status:', error);
      }
    };

    fetchProviderStatus();
  }, []);

  const handleLoginSuccess = async () => {
    // Refresh user context after successful login
    await refreshUserData();
    onLoginSuccess();
  };

  /**
   * Handle OAuth login button click
   * Closes the modal and redirects to OAuth provider
   */
  const handleOAuthLogin = (provider: OAuthProvider) => {
    setLoadingProvider(provider);

    // Close the modal before redirecting
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      // Try to close via Bootstrap
      const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    // Small delay to allow modal to close
    setTimeout(() => {
      initiateOAuthLogin(provider);
    }, 100);
  };

  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex={-1}
      aria-hidden="true"
      aria-labelledby="loginModalLabel"
    >
      <div className="modal-dialog modal-fullscreen modal-dialog-centered">
        <div className="container">
          <div className="user-data-form modal-content p-4">
            <button
              type="button"
              className="btn-close ms-auto"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>

            <div className="text-center">
              <h2 id="loginModalLabel">Hi, Welcome Back!</h2>
              <p>
                Still do not have an account?{' '}
                <Link
                  href="/register"
                  className="text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    // Close modal properly
                    const modalElement = document.getElementById('loginModal');
                    if (modalElement) {
                      const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalElement);
                      if (modalInstance) {
                        modalInstance.hide();
                      }
                    }
                    // Wait for modal to close before navigating
                    setTimeout(() => {
                      window.location.href = '/register';
                    }, 300);
                  }}
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="form-wrapper m-auto">
              <LoginForm onLoginSuccess={handleLoginSuccess} isModal={true} />

              <div className="d-flex align-items-center mt-30 mb-10">
                <div className="line flex-grow-1"></div>
                <span className="pe-3 ps-3">OR</span>
                <div className="line flex-grow-1"></div>
              </div>

              <div className="row text-center justify-content-center">
                {/* Google Login */}
                <div className="col-md-4 col-12 mb-2 mb-md-0">
                  <SocialLoginButton
                    provider="google"
                    icon={google}
                    label="Google"
                    onClick={() => handleOAuthLogin('google')}
                    isLoading={loadingProvider === 'google'}
                    disabled={!providerStatus.google || loadingProvider !== null}
                  />
                </div>

                {/* Facebook Login */}
                <div className="col-md-4 col-12 mb-2 mb-md-0">
                  <SocialLoginButton
                    provider="facebook"
                    icon={facebook}
                    label="Facebook"
                    onClick={() => handleOAuthLogin('facebook')}
                    isLoading={loadingProvider === 'facebook'}
                    disabled={!providerStatus.facebook || loadingProvider !== null}
                  />
                  {!providerStatus.facebook && (
                    <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                      Coming Soon
                    </small>
                  )}
                </div>

                {/* Apple Login */}
                <div className="col-md-4 col-12">
                  <SocialLoginButton
                    provider="apple"
                    icon={apple}
                    label="Apple"
                    onClick={() => handleOAuthLogin('apple')}
                    isLoading={loadingProvider === 'apple'}
                    disabled={!providerStatus.apple || loadingProvider !== null}
                  />
                  {!providerStatus.apple && (
                    <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                      Coming Soon
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
