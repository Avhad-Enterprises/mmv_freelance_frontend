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
            <div className='main-page-wrapper'>
              <div className='dashboard-layout'>
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