"use client";
import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
  isOpenSidebar: boolean;
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpenSidebar, setIsOpenSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return context;
};
