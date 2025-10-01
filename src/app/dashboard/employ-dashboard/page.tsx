"use client";
import React, { useEffect } from 'react';
import Wrapper from '@/layouts/wrapper';
import EmployDashboardMain from '@/app/components/dashboard/employ';
import ClientAuth from '@/middleware/client-auth';

const EmployDashboardPage = () => {
  useEffect(() => {
    // Cleanup any lingering modal-backdrop elements and modal-open class
    const removeBackdropsAndModalOpen = () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());

      document.body.classList.remove("modal-open"); // Remove modal-open class
      document.body.style.overflow = ""; // Reset overflow style
    };

    removeBackdropsAndModalOpen();

    // Optional: Clean up on unmount
    return () => removeBackdropsAndModalOpen();
  }, []);

  return (
    <ClientAuth>
      <Wrapper>
        <EmployDashboardMain/>
      </Wrapper>
    </ClientAuth>
  );
};

export default EmployDashboardPage;