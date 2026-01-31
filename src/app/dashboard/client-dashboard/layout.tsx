"use client";
import React, { useEffect } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { UserProvider } from "@/context/UserContext";
import EmployAside from "@/app/components/dashboard/employ/aside";
import ClientAuth from "@/middleware/client-auth";
import Wrapper from "@/layouts/wrapper";

export default function EmployDashboardLayout({ children }: { children: React.ReactNode }) {
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
    <ClientAuth>
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
                    ? "55px"   // mobile + tablet
                    : "0px"    // desktop
              }}
            >
              <div className="dashboard-layout">
                <EmployAside />
                {children}
              </div>
            </div>

          </SidebarProvider>
        </UserProvider>
      </Wrapper>
    </ClientAuth>
  );
}