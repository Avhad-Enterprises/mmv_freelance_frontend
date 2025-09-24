"use client"
import React, { useEffect } from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import RegisterArea from "../components/register/register-area";

export const metadata: Metadata = {
  title: "Register",
};

const RegisterPage = () => {
  useEffect(() => {
    // Clean up any modal/overlay elements
    const cleanup = () => {
      // Remove modal backdrop if exists
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }

      // Remove any custom overlays
      const overlays = document.querySelectorAll('.overlay, .modal-overlay, .loading-overlay');
      overlays.forEach(overlay => overlay.remove());

      // Reset body styles that might have been set by modal
      document.body.style.overflow = 'visible';
      document.body.classList.remove('modal-open');
    };

    // Run cleanup on mount
    cleanup();

    // Also run cleanup on unmount
    return () => cleanup();
  }, []);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}

        {/*breadcrumb start */}
        <CompanyBreadcrumb
          title="Register"
          subtitle="Create an account & Start posting or hiring talents"
        />
        {/*breadcrumb end */}

        {/* register area start */}
        <RegisterArea/>
        {/* register area end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default RegisterPage;
