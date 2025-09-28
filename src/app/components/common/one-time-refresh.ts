"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const OneTimeAutoRefresh = () => {
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh");

  useEffect(() => {
    if (shouldRefresh === "true") {
  
      window.location.replace(window.location.pathname);
    }
  }, [shouldRefresh]);

  return null; // No UI needed
};

export default OneTimeAutoRefresh;
