"use client";
import React, { useEffect } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { UserProvider } from "@/context/UserContext";
import CandidateAside from "@/app/components/dashboard/candidate/aside";
import FreelancerAuth from "@/middleware/freelancer-auth";
import Wrapper from "@/layouts/wrapper";

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
            <style jsx global>{`
              /* Prevent horizontal scroll on mobile */
              @media (max-width: 991px) {
                body, html {
                  overflow-x: hidden !important;
                  max-width: 100vw !important;
                }
                
                .dashboard-layout {
                  overflow-x: hidden !important;
                  max-width: 100vw !important;
                }
              }
            `}</style>
            <div
              style={{
                paddingTop:
                  typeof window !== "undefined" && window.innerWidth <= 992
                    ? "60px"   // mobile + tablet
                    : "0px"    // desktop
              }}
            >
              <div className="dashboard-layout">
                <CandidateAside />
                {children}
              </div>
            </div>

          </SidebarProvider>
        </UserProvider>
      </Wrapper>
    </FreelancerAuth>
  );
}