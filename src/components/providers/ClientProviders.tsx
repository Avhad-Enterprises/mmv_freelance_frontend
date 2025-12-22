"use client";

import { Providers } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "@/context/SidebarContext";
import { UserProvider } from "@/context/UserContext";
import { ConsentProvider } from "@/context/ConsentContext";
import { NotificationProvider } from "@/context/NotificationContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ConsentProvider>
        <UserProvider>
          <SidebarProvider>
            <NotificationProvider>
              <Toaster position="top-right" />
              {children}
            </NotificationProvider>
          </SidebarProvider>
        </UserProvider>
      </ConsentProvider>
    </Providers>
  );
}