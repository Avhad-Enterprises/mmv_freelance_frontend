"use client";
import React, { useEffect } from 'react';
import Wrapper from '@/layouts/wrapper';
import EmployDashboardMain from '@/app/components/dashboard/employ';
import ClientAuth from '@/middleware/client-auth';
import Header from '@/layouts/headers/headerDash'; 

const EmployDashboardPage = () => {
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
    <ClientAuth>
      <Wrapper>
        <Header />
        <EmployDashboardMain />
      </Wrapper>
    </ClientAuth>
  );
};

export default EmployDashboardPage;