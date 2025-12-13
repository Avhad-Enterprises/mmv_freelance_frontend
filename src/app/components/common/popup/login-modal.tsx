'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/app/components/forms/login-form';
import SocialLoginButton from '@/app/components/common/social-login-button';
import { initiateOAuthLogin, OAuthProvider } from '@/utils/oauth';
import google from '@/assets/images/icon/google.png';
import facebook from '@/assets/images/icon/facebook.png';
import apple from '@/assets/images/icon/apple.png';
import { useUser } from '@/context/UserContext';

interface LoginModalProps {
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess = () => { } }) => {
  const { refreshUserData } = useUser();
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);

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

  // Check if providers are enabled (Google is enabled by default in our setup)
  const isGoogleEnabled = true;
  const isFacebookEnabled = false; // Coming soon
  const isAppleEnabled = false; // Coming soon

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
                  data-bs-dismiss="modal"
                  onClick={() => {
                    if (window.location.pathname === '/register') {
                      window.location.reload();
                    }
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
                    disabled={!isGoogleEnabled || loadingProvider !== null}
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
                    disabled={!isFacebookEnabled || loadingProvider !== null}
                  />
                  {!isFacebookEnabled && (
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
                    disabled={!isAppleEnabled || loadingProvider !== null}
                  />
                  {!isAppleEnabled && (
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