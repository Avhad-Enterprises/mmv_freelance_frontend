'use client'
import React, { useState } from "react";
import Wrapper from "@/layouts/wrapper";
import EmployAside from "@/app/components/dashboard/employ/aside";
import Header from '@/layouts/headers/headerDash';
import ChatArea from "@/app/components/chatArea/chatArea";

const EmployDashboardChatPage = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  return (
    <Wrapper>
      <Header />
      {/* This main wrapper should NOT use flexbox */}
      <div className="main-page-wrapper">
        {/* Render the sidebar first */}
        <EmployAside
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />

        {/* Wrap the ChatArea in the 'dashboard-body' div */}
        {/* This div gets the margin-left from your CSS and we give it a calculated height */}
        <div className="dashboard-body" style={{ height: 'calc(100vh - 85px)' }}>
          <ChatArea setIsOpenSidebar={setIsOpenSidebar} />
        </div>
      </div>
    </Wrapper>
  );
};

export default EmployDashboardChatPage;