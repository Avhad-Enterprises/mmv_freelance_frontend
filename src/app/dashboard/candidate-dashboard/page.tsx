"use client";
import React, { useEffect } from 'react';
import Wrapper from '@/layouts/wrapper';
import CandidateDashboardMain from '@/app/components/dashboard/candidate';
import FreelancerAuth from '@/middleware/freelancer-auth';
import Header from '@/layouts/headers/headerDash';

const CandidateDashboardPage = () => {
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
    <FreelancerAuth>
      <Wrapper>
        {/* Header added here */}
        <Header />
        <div className="dashboard-layout">
          {/* Sidebar and dashboard area below header */}
          <CandidateDashboardMain />
        </div>
      </Wrapper>
    </FreelancerAuth>
  );
};

export default CandidateDashboardPage;