import React from "react";
import DashboardHeader from "../candidate/dashboard-header";
import ChangePasswordArea from "../candidate/change-password";
import LinkedAccountsSection from "../settings/linked-accounts";
import { useSidebar } from "@/context/SidebarContext";

type IProps = {
  // No props needed, using context
};

const DashboardSettingArea = ({ }: IProps) => {
  const { setIsOpenSidebar } = useSidebar();

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader />
        {/* header end */}

        <h2 className="main-title">Account Settings</h2>

        {/* change password area */}
        <ChangePasswordArea />
        {/* change password area */}

        {/* linked accounts area */}
        <LinkedAccountsSection />
        {/* linked accounts area end */}
      </div>
    </div>
  );
};

export default DashboardSettingArea;