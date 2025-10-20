"use client";
import React from "react";
import DashboardHeader from "../candidate/dashboard-header";
import ChatArea from "@/app/components/chatArea/chatArea";

const EmployChatArea = () => {
  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader />
        {/* header end */}

        <h2 className="main-title">Messages</h2>
        
        <div className="bg-white card-box border-20">
          <ChatArea />
        </div>
      </div>
    </div>
  );
};

export default EmployChatArea;
