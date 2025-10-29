import React from "react";
import DashboardHeader from "./dashboard-header-minus";
import ChangePasswordArea from "./change-password";
import { useSidebar } from "@/context/SidebarContext";

type IProps = {
  // No props needed, using context
};

const DashboardSettingArea = ({}: IProps) => {
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
      </div>
    </div>
  );
};

export default DashboardSettingArea;
