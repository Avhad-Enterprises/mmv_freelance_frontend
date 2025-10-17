'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/app/components/forms/login-form';
import google from '@/assets/images/icon/google.png';
import facebook from '@/assets/images/icon/facebook.png';

interface LoginModalProps {
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess = () => {} }) => {
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
                <Link href="/register" className="text-primary">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="form-wrapper m-auto">
              {/* ✅ Pass both callback AND isModal flag */}
              <LoginForm onLoginSuccess={onLoginSuccess} isModal={true} />

              <div className="d-flex align-items-center mt-30 mb-10">
                <div className="line flex-grow-1"></div>
                <span className="pe-3 ps-3">OR</span>
                <div className="line flex-grow-1"></div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <a
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                  >
                    <Image src={google} alt="google-img" width={20} height={20} />
                    <span className="ps-2">Login with Google</span>
                  </a>
                </div>
                <div className="col-md-6">
                  <a
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                  >
                    <Image src={facebook} alt="facebook-img" width={20} height={20} />
                    <span className="ps-2">Login with Facebook</span>
                  </a>
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