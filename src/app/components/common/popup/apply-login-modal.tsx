'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/app/components/forms/login-form';
import google from '@/assets/images/icon/google.png';
import facebook from '@/assets/images/icon/facebook.png';
import apple from '@/assets/images/icon/apple.png';

interface ApplyLoginModalProps {
  onLoginSuccess: () => void;
}

const ApplyLoginModal: React.FC<ApplyLoginModalProps> = ({ onLoginSuccess }) => {
  return (
    <div
      className="modal fade"
      id="applyLoginModal"
      tabIndex={-1}
      aria-hidden="true"
      aria-labelledby="applyLoginModalLabel"
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
              <h2 id="applyLoginModalLabel">Login to Apply</h2>
              <p className="mb-2">You need to be logged in to apply for this project.</p>
              <p>
                Don't have an account?{' '}
                <Link href="/register" className="text-primary">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="form-wrapper m-auto">
              {/* ✅ Login form inside modal */}
              <LoginForm onLoginSuccess={onLoginSuccess} isModal={true} />

              <div className="d-flex align-items-center mt-30 mb-10">
                <div className="line flex-grow-1"></div>
                <span className="pe-3 ps-3">OR</span>
                <div className="line flex-grow-1"></div>
              </div>

              {/* ✅ Social login buttons in a single row */}
              <div className="row text-center justify-content-center">
                <div className="col-md-4 col-12 mb-2 mb-md-0">
                  <a
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100"
                  >
                    <Image src={google} alt="google-img" width={20} height={20} />
                    <span className="ps-2">Google</span>
                  </a>
                </div>
                <div className="col-md-4 col-12 mb-2 mb-md-0">
                  <a
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100"
                  >
                    <Image src={facebook} alt="facebook-img" width={20} height={20} />
                    <span className="ps-2">Facebook</span>
                  </a>
                </div>
                <div className="col-md-4 col-12">
                  <a
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100"
                  >
                    <Image src={apple} alt="apple-img" width={20} height={20} />
                    <span className="ps-2">Apple</span>
                  </a>
                </div>
              </div>
              {/* ✅ End social login buttons */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoginModal;
