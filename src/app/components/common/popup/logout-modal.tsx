"use client";
import React, { useEffect } from 'react';
import TokenRefreshService from '@/utils/tokenRefresh';
import Image from "next/image";
import icon from "@/assets/dashboard/images/icon/icon_22.svg";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { clear_wishlist } from "@/redux/features/wishlist";
import { authCookies } from "@/utils/cookies";
import { useUser } from "@/context/UserContext";

const LogoutModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { refreshUserData } = useUser();

  // Ensure modal backdrop has proper z-index
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #logoutModal.modal.show {
        z-index: 99999 !important;
      }
      #logoutModal ~ .modal-backdrop,
      .modal-backdrop.show {
        z-index: 99998 !important;
        background-color: rgba(0, 0, 0, 0.7) !important;
      }
      body.modal-open {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogout = async () => {
    // Clear token from cookies
    authCookies.removeToken();

    // Stop automatic token refresh monitoring
    const tokenRefreshService = TokenRefreshService.getInstance();
    tokenRefreshService.clearTokens();

    // Clear wishlist on logout
    dispatch(clear_wishlist());

    // Refresh user context to clear auth state
    await refreshUserData();

    // Force full page reload to homepage to ensure clean state
    window.location.href = "/";
  };

  return (
    <div
      className="modal fade"
      id="logoutModal"
      tabIndex={-1}
      aria-hidden="true"
      style={{ zIndex: 99999 }}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 100000 }}>
        <div className="modal-content text-center p-4" style={{ position: 'relative', zIndex: 100001 }}>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <Image src={icon} alt="icon" className="lazy-img m-auto mb-3" />
          <h2>Are you sure?</h2>
          <p>You will be logged out of your account.</p>
          <div className="d-flex justify-content-center gap-3 pt-3">
            <button
              className="btn btn-danger"
              onClick={handleLogout}
              data-bs-dismiss="modal"
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
