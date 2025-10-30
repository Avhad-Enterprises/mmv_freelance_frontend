"use client";
import React, { useEffect } from "react";
import { resetFilter } from "@/redux/features/filterSlice";
import { useAppDispatch } from "@/redux/hook";
import { animationCreate } from "@/utils/utils";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import TokenExpiryWarning from "@/app/components/common/token-expiry-warning";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  //  handle reset first time render this page
  const handleReset = () => {
    dispatch(resetFilter());
  };
  useEffect(() => {
    animationCreate();
  }, []);
  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <>
      {children} 
      <ToastContainer />
      <Toaster position="top-center" />
      <TokenExpiryWarning />
    </>
  );
};

export default Wrapper;
