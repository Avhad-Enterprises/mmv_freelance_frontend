"use client";

import { Providers } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "@/context/SidebarContext";
import { UserProvider } from "@/context/UserContext";
import { ConsentProvider } from "@/context/ConsentContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SocketProvider } from "@/context/SocketContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ConsentProvider>
        <UserProvider>
          <SidebarProvider>
            <NotificationProvider>
              <SocketProvider>
                <Toaster position="top-right" />
                {children}
              </SocketProvider>
            </NotificationProvider>
          </SidebarProvider>
        </UserProvider>
      </ConsentProvider>
    </Providers>
  );
}