"use client";
import React, { useEffect } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { UserProvider } from "@/context/UserContext";
import CandidateAside from "@/app/components/dashboard/candidate/aside";
import FreelancerAuth from "@/middleware/freelancer-auth";
import Wrapper from "@/layouts/wrapper";
import { SignupBonusProvider, useSignupBonus } from "@/context/SignupBonusContext";
import { SignupBonusPopup } from "@/app/components/credits";

// Inner component that uses the SignupBonus context
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { showBonusPopup, dismissBonusPopup, checkAndShowBonusPopup } = useSignupBonus();

  useEffect(() => {
    // Check if we should show the bonus popup on mount
    checkAndShowBonusPopup();
  }, [checkAndShowBonusPopup]);

  return (
    <>
      <div style={{ paddingTop: '1rem' }}>
        <div className='dashboard-layout'>
          <CandidateAside />
          {children}
        </div>
      </div>
      
      {/* Signup Bonus Popup */}
      <SignupBonusPopup 
        isOpen={showBonusPopup} 
        onClose={dismissBonusPopup} 
      />
    </>
  );
}

export default function CandidateDashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Cleanup any lingering modal-backdrop elements
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
    <FreelancerAuth>
      <Wrapper>
        <UserProvider>
          <SidebarProvider>
            <SignupBonusProvider>
              <DashboardContent>{children}</DashboardContent>
            </SignupBonusProvider>
          </SidebarProvider>
        </UserProvider>
      </Wrapper>
    </FreelancerAuth>
  );
}