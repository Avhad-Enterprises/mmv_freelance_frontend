"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import FooterOne from "@/layouts/footers/footer-one";
import ResetPasswordArea from "../components/reset-password/reset-password-area";

const ResetPasswordPage = () => {
  useEffect(() => {
    const removeBackdropsAndModalOpen = () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };

    removeBackdropsAndModalOpen();
    return () => removeBackdropsAndModalOpen();
  }, []);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />
        <ResetPasswordArea />
        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default ResetPasswordPage;