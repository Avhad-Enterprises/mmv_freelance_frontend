import React from "react";
import EmployAside from "@/app/components/dashboard/employ/aside";
import ApprovedProjectsArea from "@/app/components/dashboard/employ/approved-projects-area";

const ApprovedProjectsPage = () => {
  return (
    <div className='dashboard-wrapper'>
        <EmployAside />
        <ApprovedProjectsArea />
    </div>
  );
};

export default ApprovedProjectsPage;
